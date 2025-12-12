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
exports.WallFeedController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wall_feed_service_1 = require("./wall-feed.service");
const dto_1 = require("./dto");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let WallFeedController = class WallFeedController {
    constructor(wallService) {
        this.wallService = wallService;
    }
    async getFeed(filters) {
        return this.wallService.getFeed(filters);
    }
    async createPost(user, dto) {
        return this.wallService.createPost(user.id, dto);
    }
    async getPost(id) {
        return this.wallService.getPost(id);
    }
    async deletePost(id, user) {
        await this.wallService.deletePost(id, user.id);
        return { success: true };
    }
};
exports.WallFeedController = WallFeedController;
__decorate([
    (0, common_1.Get)('feed'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir le fil d\'actualité mixte (Posts + Missions)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste paginée des éléments du fil' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetFeedDto]),
    __metadata("design:returntype", Promise)
], WallFeedController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Post)('posts'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle annonce' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Annonce créée' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreatePostDto]),
    __metadata("design:returntype", Promise)
], WallFeedController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)('posts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir le détail d\'une annonce' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WallFeedController.prototype, "getPost", null);
__decorate([
    (0, common_1.Delete)('posts/:id'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une annonce' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WallFeedController.prototype, "deletePost", null);
exports.WallFeedController = WallFeedController = __decorate([
    (0, swagger_1.ApiTags)('wall'),
    (0, common_1.Controller)('wall'),
    __metadata("design:paramtypes", [wall_feed_service_1.WallFeedService])
], WallFeedController);
//# sourceMappingURL=wall-feed.controller.js.map