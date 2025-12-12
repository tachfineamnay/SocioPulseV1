import { PrismaService } from '../common/prisma/prisma.service';
import { GetFeedDto, CreatePostDto } from './dto';
interface FeedItem {
    id: string;
    type: 'POST' | 'MISSION';
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar: string | null;
    authorRole: string;
    city: string | null;
    postalCode: string | null;
    tags: string[];
    category: string | null;
    createdAt: Date;
    validUntil: Date | null;
    urgencyLevel?: string;
    hourlyRate?: number;
    status?: string;
    postType?: string;
    viewCount?: number;
}
interface PaginatedFeedResult {
    items: FeedItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export declare class WallFeedService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getFeed(filters: GetFeedDto): Promise<PaginatedFeedResult>;
    createPost(authorId: string, dto: CreatePostDto): Promise<FeedItem>;
    getPost(postId: string): Promise<FeedItem>;
    deletePost(postId: string, userId: string): Promise<void>;
    private buildLocationFilter;
    private fetchPosts;
    private fetchMissions;
    private mapPostToFeedItem;
    private mapMissionToFeedItem;
    private filterByDistance;
}
export {};
