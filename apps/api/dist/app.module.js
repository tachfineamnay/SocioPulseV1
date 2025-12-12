"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./common/prisma/prisma.module");
const geocoding_module_1 = require("./common/services/geocoding.module");
const auth_module_1 = require("./auth/auth.module");
const matching_engine_module_1 = require("./matching-engine/matching-engine.module");
const video_booking_module_1 = require("./video-booking/video-booking.module");
const wall_feed_module_1 = require("./wall-feed/wall-feed.module");
const contracts_module_1 = require("./contracts/contracts.module");
const messages_module_1 = require("./messages/messages.module");
const payments_module_1 = require("./payments/payments.module");
const health_module_1 = require("./health/health.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 3,
                },
                {
                    name: 'medium',
                    ttl: 10000,
                    limit: 20,
                },
                {
                    name: 'long',
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            geocoding_module_1.GeocodingModule,
            auth_module_1.AuthModule,
            matching_engine_module_1.MatchingEngineModule,
            video_booking_module_1.VideoBookingModule,
            wall_feed_module_1.WallFeedModule,
            contracts_module_1.ContractsModule,
            messages_module_1.MessagesModule,
            payments_module_1.PaymentsModule,
            health_module_1.HealthModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map