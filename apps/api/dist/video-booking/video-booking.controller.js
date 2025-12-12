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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoBookingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const video_booking_service_1 = require("./video-booking.service");
const dto_1 = require("./dto");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let VideoBookingController = class VideoBookingController {
    constructor(videoService) {
        this.videoService = videoService;
    }
    async createSession(dto) {
        return this.videoService.generateVideoSlot(dto);
    }
    async joinSession(roomId, user) {
        return this.videoService.joinVideoSession(roomId, user.id, user.email);
    }
    async endSession(roomId, body) {
        await this.videoService.endVideoSession(roomId, body.recordingUrl);
        return { success: true };
    }
    async getUpcoming(user) {
        return this.videoService.getUpcomingSessions(user.id);
    }
};
exports.VideoBookingController = VideoBookingController;
__decorate([
    (0, common_1.Post)('sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une session vidéo pour un booking' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dto_1.VideoRoomDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateVideoSessionDto]),
    __metadata("design:returntype", Promise)
], VideoBookingController.prototype, "createSession", null);
__decorate([
    (0, common_1.Post)('sessions/:roomId/join'),
    (0, swagger_1.ApiOperation)({ summary: 'Rejoindre une session vidéo' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.VideoTokenDto }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideoBookingController.prototype, "joinSession", null);
__decorate([
    (0, common_1.Post)('sessions/:roomId/end'),
    (0, swagger_1.ApiOperation)({ summary: 'Terminer une session vidéo' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideoBookingController.prototype, "endSession", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les sessions vidéo à venir' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoBookingController.prototype, "getUpcoming", null);
exports.VideoBookingController = VideoBookingController = __decorate([
    (0, swagger_1.ApiTags)('video'),
    (0, common_1.Controller)('video'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [video_booking_service_1.VideoBookingService])
], VideoBookingController);
//# sourceMappingURL=video-booking.controller.js.map