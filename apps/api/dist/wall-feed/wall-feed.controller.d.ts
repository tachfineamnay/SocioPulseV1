import { WallFeedService } from './wall-feed.service';
import { GetFeedDto, CreatePostDto } from './dto';
import { CurrentUserPayload } from '../common/decorators';
export declare class WallFeedController {
    private readonly wallService;
    constructor(wallService: WallFeedService);
    getFeed(filters: GetFeedDto): Promise<any>;
    createPost(user: CurrentUserPayload, dto: CreatePostDto): Promise<any>;
    getPost(id: string): Promise<any>;
    deletePost(id: string, user: CurrentUserPayload): Promise<{
        success: boolean;
    }>;
}
