import { PrismaService } from '../common/prisma/prisma.service';
import { SendMessageDto } from './dto';
export declare class MessagesService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    send(senderId: string, dto: SendMessageDto): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        receiverId: string;
        attachments: import("@prisma/client/runtime/library").JsonValue;
        isRead: boolean;
        readAt: Date | null;
        referenceType: string | null;
        referenceId: string | null;
    }>;
}
