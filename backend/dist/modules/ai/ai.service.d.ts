import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private readonly logger;
    private anthropic;
    constructor(configService: ConfigService);
    generateProposal(userQuery: string, history?: any[]): Promise<any>;
    private parseAiResponse;
}
