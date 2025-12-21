import { IsString, IsArray, IsOptional, MinLength, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ChecklistItem {
    @IsString()
    id: string;

    @IsString()
    text: string;
}

export class CreateInstructionsDto {
    @ApiProperty({ description: 'Instructions content for the talent' })
    @IsString()
    @MinLength(10)
    content: string;

    @ApiPropertyOptional({ description: 'Checklist items for the talent to complete' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChecklistItem)
    checklist?: ChecklistItem[];
}
