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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoTokenDto = exports.JoinVideoSessionDto = exports.VideoRoomDto = exports.CreateVideoSessionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateVideoSessionDto {
}
exports.CreateVideoSessionDto = CreateVideoSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du booking associé' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoSessionDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Durée en minutes', default: 60 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], CreateVideoSessionDto.prototype, "durationMinutes", void 0);
class VideoRoomDto {
}
exports.VideoRoomDto = VideoRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VideoRoomDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VideoRoomDto.prototype, "roomName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VideoRoomDto.prototype, "hostToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VideoRoomDto.prototype, "participantToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VideoRoomDto.prototype, "meetingUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], VideoRoomDto.prototype, "expiresAt", void 0);
class JoinVideoSessionDto {
}
exports.JoinVideoSessionDto = JoinVideoSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la room vidéo' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JoinVideoSessionDto.prototype, "roomId", void 0);
class VideoTokenDto {
}
exports.VideoTokenDto = VideoTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VideoTokenDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VideoTokenDto.prototype, "roomName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VideoTokenDto.prototype, "meetingUrl", void 0);
//# sourceMappingURL=video.dto.js.map