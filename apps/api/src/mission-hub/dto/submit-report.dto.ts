import { IsString, IsOptional, IsNumber, Min, Max, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitReportDto {
    @ApiProperty({ description: 'Main report content', minLength: 10 })
    @IsString()
    @MinLength(10, { message: 'Le rapport doit contenir au moins 10 caractères' })
    content: string;

    @ApiPropertyOptional({ description: 'Any incidents or issues encountered' })
    @IsOptional()
    @IsString()
    incidents?: string;

    @ApiPropertyOptional({ description: 'Actual hours worked', minimum: 0.5, maximum: 24 })
    @IsOptional()
    @IsNumber()
    @Min(0.5)
    @Max(24)
    hoursWorked?: number;
}
