import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    Headers,
    UseGuards,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminNoteDto, AdminNoteResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles, CurrentUser, CurrentUserPayload } from '../common/decorators';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
    private readonly logger = new Logger(AdminController.name);

    constructor(private readonly adminService: AdminService) { }

    // =========================================================================
    // DATABASE SEED (uses header secret, not JWT)
    // =========================================================================

    @Post('seed')
    @ApiOperation({ summary: 'Seed the database (protected by ADMIN_SECRET header)' })
    @ApiResponse({ status: 200, description: 'Database seeded successfully' })
    @ApiResponse({ status: 401, description: 'Invalid admin secret' })
    async seedDatabase(@Headers('x-admin-secret') secret: string) {
        const adminSecret = process.env.ADMIN_SECRET;

        if (!adminSecret || secret !== adminSecret) {
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

    // =========================================================================
    // DASHBOARD
    // =========================================================================

    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Statistiques du dashboard admin' })
    @ApiResponse({ status: 200, description: 'Stats utilisateurs, documents, missions, finance' })
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('dashboard/activity')
    @ApiOperation({ summary: 'Activité récente' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Liste des dernières activités' })
    async getRecentActivity(@Query('limit') limit?: string) {
        return this.adminService.getRecentActivity(limit ? parseInt(limit, 10) : 10);
    }

    // =========================================================================
    // USERS MANAGEMENT
    // =========================================================================

    @Get('users')
    @ApiOperation({ summary: 'Liste tous les utilisateurs avec pagination (CRM)' })
    @ApiQuery({ name: 'role', required: false, enum: ['CLIENT', 'TALENT', 'ADMIN'] })
    @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'VERIFIED', 'SUSPENDED', 'BANNED'] })
    @ApiQuery({ name: 'clientType', required: false, enum: ['PARTICULAR', 'ESTABLISHMENT'] })
    @ApiQuery({ name: 'isVerified', required: false, type: Boolean })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Liste paginée des utilisateurs' })
    async findAllUsers(
        @Query('role') role?: string,
        @Query('status') status?: string,
        @Query('clientType') clientType?: string,
        @Query('isVerified') isVerified?: string,
        @Query('search') search?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.findAllUsers({
            role,
            status,
            clientType,
            isVerified: isVerified === 'true' ? true : isVerified === 'false' ? false : undefined,
            search,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }

    @Get('users/:id')
    @ApiOperation({ summary: 'Détails complets d\'un utilisateur (Profil, Docs, Notes, Historique)' })
    @ApiResponse({ status: 200, description: 'Détails de l\'utilisateur' })
    async getUserDetails(@Param('id') id: string) {
        return this.adminService.getUserDetails(id);
    }

    @Patch('users/:id/validate')
    @ApiOperation({ summary: 'Valider un utilisateur (isVerified = true)' })
    @ApiResponse({ status: 200, description: 'Utilisateur validé' })
    async validateUser(
        @Param('id') targetUserId: string,
        @CurrentUser() admin: CurrentUserPayload,
    ) {
        return this.adminService.validateUser(admin.id, targetUserId);
    }

    @Patch('users/:id/verify')
    @ApiOperation({ summary: 'Vérifier un utilisateur (alias validate)' })
    @ApiResponse({ status: 200, description: 'Utilisateur vérifié' })
    async verifyUser(
        @Param('id') targetUserId: string,
        @CurrentUser() admin: CurrentUserPayload,
    ) {
        return this.adminService.validateUser(admin.id, targetUserId);
    }

    @Patch('users/:id/suspend')
    @ApiOperation({ summary: 'Suspendre un utilisateur' })
    @ApiResponse({ status: 200, description: 'Utilisateur suspendu' })
    async suspendUser(
        @Param('id') targetUserId: string,
        @Body() body: { reason?: string },
        @CurrentUser() admin: CurrentUserPayload,
    ) {
        return this.adminService.suspendUser(admin.id, targetUserId, body.reason);
    }

    @Patch('users/:id/ban')
    @ApiOperation({ summary: 'Bannir un utilisateur' })
    @ApiResponse({ status: 200, description: 'Utilisateur banni' })
    async banUser(
        @Param('id') targetUserId: string,
        @Body() body: { reason?: string },
        @CurrentUser() admin: CurrentUserPayload,
    ) {
        return this.adminService.banUser(admin.id, targetUserId, body.reason);
    }

    @Patch('users/:id/tags')
    @ApiOperation({ summary: 'Mettre à jour les tags internes d\'un utilisateur' })
    @ApiResponse({ status: 200, description: 'Tags mis à jour' })
    async updateInternalTags(
        @Param('id') targetUserId: string,
        @Body() body: { tags: string[] },
        @CurrentUser() admin: CurrentUserPayload,
    ) {
        return this.adminService.updateInternalTags(admin.id, targetUserId, body.tags);
    }

    // =========================================================================
    // ADMIN NOTES
    // =========================================================================

    @Post('users/:id/notes')
    @ApiOperation({ summary: 'Ajouter une note CRM sur un utilisateur' })
    @ApiResponse({ status: 201, type: AdminNoteResponseDto })
    async addNote(
        @Param('id') targetUserId: string,
        @Body() dto: CreateAdminNoteDto,
        @CurrentUser() admin: CurrentUserPayload,
    ) {
        return this.adminService.addNote(admin.id, targetUserId, dto.content);
    }

    @Get('users/:id/notes')
    @ApiOperation({ summary: 'Récupérer les notes CRM d\'un utilisateur' })
    @ApiResponse({ status: 200, type: [AdminNoteResponseDto] })
    async getUserNotes(@Param('id') targetUserId: string) {
        return this.adminService.getUserNotes(targetUserId);
    }

    // =========================================================================
    // DOCUMENTS (MODERATION)
    // =========================================================================

    @Get('documents')
    @ApiOperation({ summary: 'Liste des documents avec filtres' })
    @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED'] })
    @ApiQuery({ name: 'userId', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Liste paginée des documents' })
    async getDocuments(
        @Query('status') status?: string,
        @Query('userId') userId?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getDocuments({
            status,
            userId,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }

    @Patch('documents/:id/status')
    @ApiOperation({ summary: 'Valider ou rejeter un document' })
    @ApiResponse({ status: 200, description: 'Document mis à jour' })
    async updateDocumentStatus(
        @Param('id') documentId: string,
        @Body() body: { status: string; comment?: string },
        @CurrentUser() admin: CurrentUserPayload,
    ) {
        return this.adminService.updateDocumentStatus(admin.id, documentId, body.status, body.comment);
    }

    // =========================================================================
    // MISSIONS
    // =========================================================================

    @Get('missions')
    @ApiOperation({ summary: 'Liste des missions SOS avec filtres' })
    @ApiQuery({ name: 'status', required: false, enum: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
    @ApiQuery({ name: 'urgency', required: false, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Liste paginée des missions' })
    async getMissions(
        @Query('status') status?: string,
        @Query('urgency') urgency?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getMissions({
            status,
            urgency,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }

    @Get('missions/:id')
    @ApiOperation({ summary: 'Détails d\'une mission' })
    @ApiResponse({ status: 200, description: 'Détails complets de la mission' })
    async getMissionDetails(@Param('id') missionId: string) {
        return this.adminService.getMissionDetails(missionId);
    }

    // =========================================================================
    // AUDIT LOGS
    // =========================================================================

    @Get('audit-logs')
    @ApiOperation({ summary: 'Récupérer l\'historique d\'audit (traçabilité)' })
    @ApiQuery({ name: 'adminId', required: false })
    @ApiQuery({ name: 'targetUserId', required: false })
    @ApiQuery({ name: 'action', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Liste paginée des logs d\'audit' })
    async getAuditLogs(
        @Query('adminId') adminId?: string,
        @Query('targetUserId') targetUserId?: string,
        @Query('action') action?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getAuditLogs({
            adminId,
            targetUserId,
            action,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 50,
        });
    }
}
