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
var WallFeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WallFeedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const dto_1 = require("./dto");
let WallFeedService = WallFeedService_1 = class WallFeedService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WallFeedService_1.name);
    }
    async getFeed(filters) {
        const { type = dto_1.FeedItemType.ALL, city, postalCode, tags, category, latitude, longitude, radiusKm = 50, page = 1, limit = 20, } = filters;
        try {
            const skip = (page - 1) * limit;
            const feedItems = [];
            let totalCount = 0;
            const locationFilter = this.buildLocationFilter(city, postalCode);
            if (type === dto_1.FeedItemType.ALL || type === dto_1.FeedItemType.POST) {
                const { posts, count: postCount } = await this.fetchPosts({
                    locationFilter,
                    tags,
                    category,
                    skip: type === dto_1.FeedItemType.POST ? skip : 0,
                    take: type === dto_1.FeedItemType.POST ? limit : Math.ceil(limit / 2),
                });
                feedItems.push(...posts);
                totalCount += postCount;
            }
            if (type === dto_1.FeedItemType.ALL || type === dto_1.FeedItemType.MISSION) {
                const { missions, count: missionCount } = await this.fetchMissions({
                    locationFilter: locationFilter,
                    tags,
                    skip: type === dto_1.FeedItemType.MISSION ? skip : 0,
                    take: type === dto_1.FeedItemType.MISSION ? limit : Math.ceil(limit / 2),
                });
                feedItems.push(...missions);
                totalCount += missionCount;
            }
            feedItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            let filteredItems = feedItems;
            if (latitude && longitude) {
                filteredItems = this.filterByDistance(feedItems, latitude, longitude, radiusKm);
            }
            const paginatedItems = type === dto_1.FeedItemType.ALL
                ? filteredItems.slice(skip, skip + limit)
                : filteredItems;
            const totalForPagination = type === dto_1.FeedItemType.ALL
                ? filteredItems.length
                : totalCount;
            return {
                items: paginatedItems,
                pagination: {
                    page,
                    limit,
                    total: totalForPagination,
                    totalPages: Math.ceil(totalForPagination / limit),
                    hasNext: page * limit < totalForPagination,
                    hasPrev: page > 1,
                },
            };
        }
        catch (error) {
            this.logger.error(`getFeed failed: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération du fil');
        }
    }
    async createPost(authorId, dto) {
        try {
            const post = await this.prisma.post.create({
                data: {
                    authorId,
                    type: dto.type,
                    title: dto.title,
                    content: dto.content,
                    city: dto.city,
                    postalCode: dto.postalCode,
                    tags: dto.tags || [],
                    category: dto.category,
                    validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
                },
                include: {
                    author: {
                        include: { profile: true },
                    },
                },
            });
            this.logger.log(`Post created: ${post.id} by user ${authorId}`);
            return this.mapPostToFeedItem(post);
        }
        catch (error) {
            this.logger.error(`createPost failed: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Erreur lors de la création du post');
        }
    }
    async getPost(postId) {
        try {
            const post = await this.prisma.post.findUnique({
                where: { id: postId },
                include: {
                    author: {
                        include: { profile: true },
                    },
                },
            });
            if (!post) {
                throw new common_1.NotFoundException(`Post ${postId} non trouvé`);
            }
            await this.prisma.post.update({
                where: { id: postId },
                data: { viewCount: { increment: 1 } },
            });
            return this.mapPostToFeedItem(post);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            this.logger.error(`getPost failed: ${error.message}`);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération');
        }
    }
    async deletePost(postId, userId) {
        try {
            const post = await this.prisma.post.findUnique({
                where: { id: postId },
            });
            if (!post) {
                throw new common_1.NotFoundException(`Post ${postId} non trouvé`);
            }
            if (post.authorId !== userId) {
                throw new Error('Non autorisé à supprimer ce post');
            }
            await this.prisma.post.delete({
                where: { id: postId },
            });
            this.logger.log(`Post deleted: ${postId}`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Erreur lors de la suppression');
        }
    }
    buildLocationFilter(city, postalCode) {
        const filter = {};
        if (city) {
            filter.city = { contains: city, mode: 'insensitive' };
        }
        if (postalCode) {
            filter.postalCode = { startsWith: postalCode };
        }
        return Object.keys(filter).length > 0 ? filter : undefined;
    }
    async fetchPosts(options) {
        const { locationFilter, tags, category, skip, take } = options;
        const where = {
            isActive: true,
            OR: [
                { validUntil: null },
                { validUntil: { gte: new Date() } },
            ],
        };
        if (locationFilter) {
            Object.assign(where, locationFilter);
        }
        if (category) {
            where.category = category;
        }
        if (tags && tags.length > 0) {
            where.tags = { hasSome: tags };
        }
        const [posts, count] = await Promise.all([
            this.prisma.post.findMany({
                where,
                include: {
                    author: {
                        include: { profile: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.post.count({ where }),
        ]);
        return {
            posts: posts.map((post) => this.mapPostToFeedItem(post)),
            count,
        };
    }
    async fetchMissions(options) {
        const { locationFilter, tags, skip, take } = options;
        const where = {
            status: 'OPEN',
            startDate: { gte: new Date() },
        };
        if (locationFilter) {
            Object.assign(where, locationFilter);
        }
        const [missions, count] = await Promise.all([
            this.prisma.reliefMission.findMany({
                where,
                include: {
                    client: {
                        include: {
                            profile: true,
                            establishment: true,
                        },
                    },
                },
                orderBy: [
                    { urgencyLevel: 'desc' },
                    { createdAt: 'desc' },
                ],
                skip,
                take,
            }),
            this.prisma.reliefMission.count({ where }),
        ]);
        return {
            missions: missions.map((mission) => this.mapMissionToFeedItem(mission)),
            count,
        };
    }
    mapPostToFeedItem(post) {
        const profile = post.author?.profile;
        return {
            id: post.id,
            type: 'POST',
            title: post.title,
            content: post.content,
            authorId: post.authorId,
            authorName: profile
                ? `${profile.firstName} ${profile.lastName}`
                : post.author?.email || 'Utilisateur',
            authorAvatar: profile?.avatarUrl || null,
            authorRole: post.author?.role || 'CLIENT',
            city: post.city,
            postalCode: post.postalCode,
            tags: post.tags || [],
            category: post.category,
            createdAt: post.createdAt,
            validUntil: post.validUntil,
            postType: post.type,
            viewCount: post.viewCount,
        };
    }
    mapMissionToFeedItem(mission) {
        const establishment = mission.client?.establishment;
        const profile = mission.client?.profile;
        return {
            id: mission.id,
            type: 'MISSION',
            title: mission.title,
            content: mission.description,
            authorId: mission.clientId,
            authorName: establishment?.name || profile?.firstName || 'Établissement',
            authorAvatar: establishment?.logoUrl || profile?.avatarUrl || null,
            authorRole: 'CLIENT',
            city: mission.city,
            postalCode: mission.postalCode,
            tags: mission.requiredSkills || [],
            category: mission.jobTitle,
            createdAt: mission.createdAt,
            validUntil: mission.startDate,
            urgencyLevel: mission.urgencyLevel,
            hourlyRate: mission.hourlyRate,
            status: mission.status,
        };
    }
    filterByDistance(items, lat, lng, radiusKm) {
        return items;
    }
};
exports.WallFeedService = WallFeedService;
exports.WallFeedService = WallFeedService = WallFeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WallFeedService);
//# sourceMappingURL=wall-feed.service.js.map