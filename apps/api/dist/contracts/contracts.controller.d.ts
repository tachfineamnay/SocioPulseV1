import { ContractsService } from './contracts.service';
import { SignContractDto } from './dto';
import { CurrentUserPayload } from '../common/decorators';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    sign(user: CurrentUserPayload, dto: SignContractDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        missionId: string;
        extraId: string;
        signatureUrl: string | null;
        signedAt: Date | null;
    }>;
}
