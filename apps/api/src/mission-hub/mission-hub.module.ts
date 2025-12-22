import { Module } from '@nestjs/common';
import { MissionHubController } from './mission-hub.controller';
import { MissionHubService } from './mission-hub.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MissionAccessGuard } from '../common/guards';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, NotificationsModule, AuthModule],
    controllers: [MissionHubController],
    providers: [MissionHubService, MissionAccessGuard],
    exports: [MissionHubService],
})
export class MissionHubModule { }
