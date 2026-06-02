import { WhatsappService } from './whatsapp.service';
export declare class WhatsappController {
    private readonly whatsappService;
    private readonly logger;
    constructor(whatsappService: WhatsappService);
    webhook(body: any): Promise<{
        status: string;
        response: any;
    } | {
        status: string;
        response?: undefined;
    }>;
    verifyWebhook(challenge: string): string;
}
