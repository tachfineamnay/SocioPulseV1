"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor() {
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async createIntent(dto) {
        try {
            const clientSecret = `pi_mock_${Date.now()}_secret`;
            this.logger.log(`PaymentIntent mock created for ${dto.amount} ${dto.currency}`);
            return { clientSecret };
        }
        catch (error) {
            this.logger.error(`createIntent failed: ${error.message}`);
            throw new common_1.InternalServerErrorException('Erreur paiement');
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)()
], PaymentsService);
//# sourceMappingURL=payments.service.js.map