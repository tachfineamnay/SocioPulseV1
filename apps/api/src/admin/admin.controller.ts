import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
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
    constructor(private readonly adminService: AdminService) {}

    // =========================================================================
    // USERS MANAGEMENT
    // =========================================================================

    @Get('users')
    @ApiOperation({ summary: 'Liste tous les utilisateurs avec pagination (CRM)' })
    @ApiQuery({ name: 'role', required: false, enum: ['CLIENT', 'EXTRA', 'ADMIN'] })
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
    // DOCUMENTS
    // =========================================================================

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
