export declare enum FeedItemType {
    POST = "POST",
    MISSION = "MISSION",
    ALL = "ALL"
}
export declare enum PostType {
    OFFER = "OFFER",
    NEED = "NEED"
}
export declare class GetFeedDto {
    type?: FeedItemType;
    city?: string;
    postalCode?: string;
    tags?: string[];
    category?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    page?: number;
    limit?: number;
}
export declare class CreatePostDto {
    type: PostType;
    title: string;
    content: string;
    city?: string;
    postalCode?: string;
    tags?: string[];
    category?: string;
    validUntil?: string;
}
