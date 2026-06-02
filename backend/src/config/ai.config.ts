import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  anthropicKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-5-sonnet-20240620', // Claude 3.5 Sonnet
}));
