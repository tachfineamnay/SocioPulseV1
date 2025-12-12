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
exports.CreateMissionDto = exports.MatchingResultDto = exports.CandidateResultDto = exports.FindCandidatesDto = exports.MissionUrgency = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var MissionUrgency;
(function (MissionUrgency) {
    MissionUrgency["LOW"] = "LOW";
    MissionUrgency["MEDIUM"] = "MEDIUM";
    MissionUrgency["HIGH"] = "HIGH";
    MissionUrgency["CRITICAL"] = "CRITICAL";
})(MissionUrgency || (exports.MissionUrgency = MissionUrgency = {}));
class FindCandidatesDto {
}
exports.FindCandidatesDto = FindCandidatesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filtrer par compétences requises' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], FindCandidatesDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rayon de recherche en km', default: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], FindCandidatesDto.prototype, "radiusKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nombre maximum de candidats', default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], FindCandidatesDto.prototype, "limit", void 0);
class CandidateResultDto {
}
exports.CandidateResultDto = CandidateResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateResultDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateResultDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateResultDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateResultDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateResultDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateResultDto.prototype, "headline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], CandidateResultDto.prototype, "specialties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], CandidateResultDto.prototype, "diplomas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CandidateResultDto.prototype, "hourlyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CandidateResultDto.prototype, "averageRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CandidateResultDto.prototype, "totalMissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Distance en km depuis la mission' }),
    __metadata("design:type", Number)
], CandidateResultDto.prototype, "distance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Score de matching (0-100)' }),
    __metadata("design:type", Number)
], CandidateResultDto.prototype, "matchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Disponibilité vérifiée' }),
    __metadata("design:type", Boolean)
], CandidateResultDto.prototype, "isAvailable", void 0);
class MatchingResultDto {
}
exports.MatchingResultDto = MatchingResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CandidateResultDto] }),
    __metadata("design:type", Array)
], MatchingResultDto.prototype, "candidates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MatchingResultDto.prototype, "totalFound", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MatchingResultDto.prototype, "searchRadius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchingResultDto.prototype, "missionId", void 0);
class CreateMissionDto {
}
exports.CreateMissionDto = CreateMissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Intitulé du poste' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Titre personnalisé de la mission' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Taux horaire en EUR' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMissionDto.prototype, "hourlyRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mission de nuit', default: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMissionDto.prototype, "isNightShift", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: MissionUrgency, default: MissionUrgency.HIGH }),
    (0, class_validator_1.IsEnum)(MissionUrgency),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "urgencyLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description de la mission' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de début (ISO)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date de fin (ISO)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ville' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Code postal' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Adresse complète' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Latitude' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMissionDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Longitude' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMissionDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rayon de recherche', default: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMissionDto.prototype, "radiusKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Compétences requises', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMissionDto.prototype, "requiredSkills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diplômes requis', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMissionDto.prototype, "requiredDiplomas", void 0);
//# sourceMappingURL=matching.dto.js.map