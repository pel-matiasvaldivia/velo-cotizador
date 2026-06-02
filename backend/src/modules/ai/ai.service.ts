import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { VELO_SYSTEM_PROMPT } from './prompts/system-prompt';
import { VELO_CATALOG_CONTEXT } from './prompts/catalog-context';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private anthropic: Anthropic;

  constructor(private configService: ConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ai.anthropicKey'),
    });
  }

  async generateProposal(userQuery: string, history: any[] = []) {
    try {
      const messages: any[] = [
        ...history,
        { role: 'user', content: userQuery }
      ];

      const response = await this.anthropic.messages.create({
        model: this.configService.get<string>('ai.model') as any,
        max_tokens: 4096,
        system: `${VELO_SYSTEM_PROMPT}\n\n${VELO_CATALOG_CONTEXT}`,
        messages: messages,
      });

      const content = response.content[0];
      if ('text' in content) {
        return this.parseAiResponse(content.text);
      }
      
      throw new Error('Unexpected AI response format');
    } catch (error) {
      this.logger.error('Error generating AI proposal', error);
      throw error;
    }
  }

  private parseAiResponse(text: string) {
    try {
      // Find JSON block if AI wrapped it in markdown
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      return JSON.parse(jsonStr);
    } catch (error) {
      this.logger.error('Failed to parse AI response as JSON', text);
      return {
        tipo: 'error',
        message: 'No se pudo procesar la respuesta técnica. Por favor, intente nuevamente.'
      };
    }
  }
}
