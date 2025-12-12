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
var MessagesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let MessagesService = MessagesService_1 = class MessagesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MessagesService_1.name);
    }
    async send(senderId, dto) {
        try {
            const recipient = await this.prisma.user.findUnique({ where: { id: dto.recipientId } });
            if (!recipient) {
                throw new common_1.NotFoundException(`Destinataire ${dto.recipientId} non trouvé`);
            }
            const message = await this.prisma.message.create({
                data: {
                    senderId,
                    receiverId: dto.recipientId,
                    content: dto.content,
                    attachments: [],
                },
            });
            return message;
        }
        catch (error) {
            this.logger.error(`send message failed: ${error.message}`);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Erreur lors de lenvoi du message');
        }
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = MessagesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map