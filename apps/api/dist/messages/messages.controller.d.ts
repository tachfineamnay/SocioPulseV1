import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto';
import { CurrentUserPayload } from '../common/decorators';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    sendMessage(user: CurrentUserPayload, dto: SendMessageDto): Promise<{
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
