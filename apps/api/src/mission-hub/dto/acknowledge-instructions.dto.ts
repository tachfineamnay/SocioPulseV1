import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AcknowledgeInstructionsDto {
    @ApiPropertyOptional({ description: 'Optional confirmation flag' })
    @IsOptional()
    @IsBoolean()
    confirmed?: boolean;
}
