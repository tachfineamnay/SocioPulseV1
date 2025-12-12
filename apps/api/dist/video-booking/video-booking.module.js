"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoBookingModule = void 0;
const common_1 = require("@nestjs/common");
const video_booking_controller_1 = require("./video-booking.controller");
const video_booking_service_1 = require("./video-booking.service");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../common/prisma/prisma.module");
let VideoBookingModule = class VideoBookingModule {
};
exports.VideoBookingModule = VideoBookingModule;
exports.VideoBookingModule = VideoBookingModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, prisma_module_1.PrismaModule],
        controllers: [video_booking_controller_1.VideoBookingController],
        providers: [video_booking_service_1.VideoBookingService],
        exports: [video_booking_service_1.VideoBookingService],
    })
], VideoBookingModule);
//# sourceMappingURL=video-booking.module.js.map