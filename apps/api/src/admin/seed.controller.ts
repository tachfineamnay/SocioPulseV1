import { Controller, Post, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AdminService } from './admin.service';

/**
 * Seed Controller - No JWT Guard
 * Protected only by ADMIN_SECRET header
 */
@ApiTags('system')
@Controller('system')
export class SeedController {
    private readonly logger = new Logger(SeedController.name);

    constructor(private readonly adminService: AdminService) { }

    @Post('seed')
    @ApiOperation({ summary: 'Seed the database (protected by ADMIN_SECRET header)' })
    @ApiHeader({ name: 'x-admin-secret', required: true, description: 'Admin secret key' })
    @ApiResponse({ status: 200, description: 'Database seeded successfully' })
    @ApiResponse({ status: 401, description: 'Invalid admin secret' })
    async seedDatabase(@Headers('x-admin-secret') secret: string) {
        const adminSecret = process.env.ADMIN_SECRET;

        if (!adminSecret) {
            this.logger.error('ADMIN_SECRET environment variable not set');
            throw new UnauthorizedException('Admin secret not configured');
        }

        if (secret !== adminSecret) {
            this.logger.warn('Invalid admin secret attempt');
            throw new UnauthorizedException('Invalid admin secret');
        }

        this.logger.log('🌱 Starting database seed via API...');

        try {
            const result = await this.adminService.seedDatabase();
            this.logger.log('✅ Database seeded successfully');
            return { success: true, ...result };
        } catch (error) {
            this.logger.error(`❌ Seed failed: ${error.message}`, error.stack);
            throw error;
        }
    }
}
