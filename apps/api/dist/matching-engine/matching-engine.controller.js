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
exports.MatchingEngineController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const matching_engine_service_1 = require("./matching-engine.service");
const dto_1 = require("./dto");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let MatchingEngineController = class MatchingEngineController {
    constructor(matchingService) {
        this.matchingService = matchingService;
    }
    async createMission(user, dto) {
        return this.matchingService.createMission(dto, user.id);
    }
    async findCandidates(missionId, options) {
        return this.matchingService.findCandidates(missionId, options);
    }
    async getMission(missionId) {
        return this.matchingService.getMissionWithApplications(missionId);
    }
    async applyToMission(missionId, user, body) {
        return this.matchingService.applyToMission(missionId, user.id, body.coverLetter, body.proposedRate);
    }
};
exports.MatchingEngineController = MatchingEngineController;
__decorate([
    (0, common_1.Post)('missions'),
    (0, decorators_1.Roles)('CLIENT', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une mission SOS' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mission créée' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateMissionDto]),
    __metadata("design:returntype", Promise)
], MatchingEngineController.prototype, "createMission", null);
__decorate([
    (0, common_1.Get)('missions/:missionId/candidates'),
    (0, decorators_1.Roles)('CLIENT', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Trouver des candidats pour une mission SOS' }),
    (0, swagger_1.ApiParam)({ name: 'missionId', description: 'ID de la mission' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.MatchingResultDto }),
    __param(0, (0, common_1.Param)('missionId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.FindCandidatesDto]),
    __metadata("design:returntype", Promise)
], MatchingEngineController.prototype, "findCandidates", null);
__decorate([
    (0, common_1.Get)('missions/:missionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les détails d\'une mission avec les candidatures' }),
    (0, swagger_1.ApiParam)({ name: 'missionId', description: 'ID de la mission' }),
    __param(0, (0, common_1.Param)('missionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchingEngineController.prototype, "getMission", null);
__decorate([
    (0, common_1.Post)('missions/:missionId/apply'),
    (0, decorators_1.Roles)('EXTRA'),
    (0, swagger_1.ApiOperation)({ summary: 'Postuler à une mission SOS' }),
    (0, swagger_1.ApiParam)({ name: 'missionId', description: 'ID de la mission' }),
    __param(0, (0, common_1.Param)('missionId')),
    __param(1, (0, decorators_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MatchingEngineController.prototype, "applyToMission", null);
exports.MatchingEngineController = MatchingEngineController = __decorate([
    (0, swagger_1.ApiTags)('matching'),
    (0, common_1.Controller)('matching'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [matching_engine_service_1.MatchingEngineService])
], MatchingEngineController);
//# sourceMappingURL=matching-engine.controller.js.map