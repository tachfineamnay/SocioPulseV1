import { PrismaService } from '../common/prisma/prisma.service';
import { SignContractDto } from './dto';
export declare class ContractsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    signContract(extraId: string, dto: SignContractDto): Promise<{
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
