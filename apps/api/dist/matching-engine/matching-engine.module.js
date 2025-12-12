"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingEngineModule = void 0;
const common_1 = require("@nestjs/common");
const matching_engine_controller_1 = require("./matching-engine.controller");
const matching_engine_service_1 = require("./matching-engine.service");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../common/prisma/prisma.module");
let MatchingEngineModule = class MatchingEngineModule {
};
exports.MatchingEngineModule = MatchingEngineModule;
exports.MatchingEngineModule = MatchingEngineModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, prisma_module_1.PrismaModule],
        controllers: [matching_engine_controller_1.MatchingEngineController],
        providers: [matching_engine_service_1.MatchingEngineService],
        exports: [matching_engine_service_1.MatchingEngineService],
    })
], MatchingEngineModule);
//# sourceMappingURL=matching-engine.module.js.map