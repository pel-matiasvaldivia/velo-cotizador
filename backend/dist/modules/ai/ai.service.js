"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const system_prompt_1 = require("./prompts/system-prompt");
const catalog_context_1 = require("./prompts/catalog-context");
let AiService = AiService_1 = class AiService {
    configService;
    logger = new common_1.Logger(AiService_1.name);
    anthropic;
    constructor(configService) {
        this.configService = configService;
        this.anthropic = new sdk_1.default({
            apiKey: this.configService.get('ai.anthropicKey'),
        });
    }
    async generateProposal(userQuery, history = []) {
        try {
            const messages = [
                ...history,
                { role: 'user', content: userQuery }
            ];
            const response = await this.anthropic.messages.create({
                model: this.configService.get('ai.model'),
                max_tokens: 4096,
                system: `${system_prompt_1.VELO_SYSTEM_PROMPT}\n\n${catalog_context_1.VELO_CATALOG_CONTEXT}`,
                messages: messages,
            });
            const content = response.content[0];
            if ('text' in content) {
                return this.parseAiResponse(content.text);
            }
            throw new Error('Unexpected AI response format');
        }
        catch (error) {
            this.logger.error('Error generating AI proposal', error);
            throw error;
        }
    }
    parseAiResponse(text) {
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : text;
            return JSON.parse(jsonStr);
        }
        catch (error) {
            this.logger.error('Failed to parse AI response as JSON', text);
            return {
                tipo: 'error',
                message: 'No se pudo procesar la respuesta técnica. Por favor, intente nuevamente.'
            };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map