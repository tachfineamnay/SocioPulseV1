"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../common/prisma/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.SALT_ROUNDS = 12;
    }
    async register(dto) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: dto.email.toLowerCase() },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Un compte existe déjà avec cet email');
            }
            const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email.toLowerCase(),
                    passwordHash,
                    role: dto.role,
                    phone: dto.phone,
                    status: 'PENDING',
                },
            });
            this.logger.log(`New user registered: ${user.email} (${user.role})`);
            return this.generateAuthResponse(user);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error(`Registration failed: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Erreur lors de l\'inscription');
        }
    }
    async login(dto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: dto.email.toLowerCase() },
            });
            if (!user || !user.passwordHash) {
                throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
            }
            const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
            }
            if (user.status === 'BANNED') {
                throw new common_1.UnauthorizedException('Votre compte a été suspendu');
            }
            await this.prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });
            this.logger.log(`User logged in: ${user.email}`);
            return this.generateAuthResponse(user);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Login failed: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Erreur lors de la connexion');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Utilisateur non trouvé');
            }
            if (user.status === 'BANNED') {
                throw new common_1.UnauthorizedException('Votre compte a été suspendu');
            }
            return this.generateAuthResponse(user);
        }
        catch (error) {
            this.logger.warn(`Token refresh failed: ${error.message}`);
            throw new common_1.UnauthorizedException('Token de rafraîchissement invalide');
        }
    }
    async getMe(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true,
                    walletBalance: true,
                    createdAt: true,
                    profile: true,
                    establishment: true,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Utilisateur non trouvé');
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error(`GetMe failed: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération du profil');
        }
    }
    async generateAuthResponse(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
            }),
        ]);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map