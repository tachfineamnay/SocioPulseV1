import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { SeedController } from './seed.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../common/prisma/prisma.module';
import { GrowthModule } from '../growth/growth.module';

@Module({
    imports: [AuthModule, PrismaModule, GrowthModule],
    controllers: [AdminController, SeedController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule { }

