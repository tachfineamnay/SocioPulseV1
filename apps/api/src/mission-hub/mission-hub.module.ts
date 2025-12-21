import { Module } from '@nestjs/common';
import { MissionHubController } from './mission-hub.controller';
import { MissionHubService } from './mission-hub.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MissionHubController],
    providers: [MissionHubService],
    exports: [MissionHubService],
})
export class MissionHubModule { }
