"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('ai', () => ({
    anthropicKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20240620',
}));
//# sourceMappingURL=ai.config.js.map