import { IsString, IsEnum, IsOptional, IsNumber, IsArray, Min, Max, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum FeedItemType {
    POST = 'POST',
    MISSION = 'MISSION',
    ALL = 'ALL',
}

export enum PostType {
    OFFER = 'OFFER',
    NEED = 'NEED',
}

export class GetFeedDto {
    @ApiPropertyOptional({ enum: FeedItemType, default: FeedItemType.ALL })
    @IsOptional()
    @IsEnum(FeedItemType)
    type?: FeedItemType = FeedItemType.ALL;

    @ApiPropertyOptional({ description: 'Filtrer par ville' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ description: 'Filtrer par code postal (prefixe)' })
    @IsOptional()
    @IsString()
    postalCode?: string;

    @ApiPropertyOptional({ description: 'Filtrer par tags' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
    tags?: string[];

    @ApiPropertyOptional({ description: 'Recherche texte' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filtrer par categorie' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ description: 'Latitude pour recherche geo' })
    @IsOptional()
    @IsNumber()
    latitude?: number;

    @ApiPropertyOptional({ description: 'Longitude pour recherche geo' })
    @IsOptional()
    @IsNumber()
    longitude?: number;

    @ApiPropertyOptional({ description: 'Rayon en km', default: 50 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(200)
    radiusKm?: number = 50;

    @ApiPropertyOptional({ description: 'Page', default: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Limite par page', default: 20 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(50)
    limit?: number = 20;
}

export class CreatePostDto {
    @ApiPropertyOptional({ enum: PostType })
    @IsEnum(PostType)
    type: PostType;

    @ApiPropertyOptional()
    @IsString()
    title: string;

    @ApiPropertyOptional()
    @IsString()
    content: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    postalCode?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    validUntil?: string;
}
