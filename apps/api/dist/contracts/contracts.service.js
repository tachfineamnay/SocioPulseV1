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
var ContractsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let ContractsService = ContractsService_1 = class ContractsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ContractsService_1.name);
    }
    async signContract(extraId, dto) {
        try {
            const mission = await this.prisma.reliefMission.findUnique({
                where: { id: dto.missionId },
                include: { contract: true },
            });
            if (!mission) {
                throw new common_1.NotFoundException(`Mission ${dto.missionId} non trouvée`);
            }
            if (mission.status === 'CANCELLED') {
                throw new common_1.BadRequestException('Mission annulée');
            }
            const content = dto.content || mission.description || 'Contrat de mission SOS';
            const signatureUrl = dto.signature;
            const now = new Date();
            const contract = await this.prisma.contract.upsert({
                where: { missionId: dto.missionId },
                update: {
                    extraId,
                    content,
                    signatureUrl,
                    status: 'SIGNED',
                    signedAt: now,
                },
                create: {
                    missionId: dto.missionId,
                    extraId,
                    content,
                    signatureUrl,
                    status: 'SIGNED',
                    signedAt: now,
                },
            });
            await this.prisma.reliefMission.update({
                where: { id: dto.missionId },
                data: {
                    assignedExtraId: mission.assignedExtraId || extraId,
                    status: 'ASSIGNED',
                },
            });
            this.logger.log(`Contract signed for mission ${dto.missionId} by ${extraId}`);
            return contract;
        }
        catch (error) {
            this.logger.error(`signContract failed: ${error.message}`);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Erreur lors de la signature du contrat');
        }
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = ContractsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map