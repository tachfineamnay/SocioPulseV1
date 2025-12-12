import { CreateIntentDto } from './dto';
export declare class PaymentsService {
    private readonly logger;
    createIntent(dto: CreateIntentDto): Promise<{
        clientSecret: string;
    }>;
}
