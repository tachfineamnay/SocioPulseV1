import { PaymentsService } from './payments.service';
import { CreateIntentDto } from './dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createIntent(dto: CreateIntentDto): Promise<{
        clientSecret: string;
    }>;
}
