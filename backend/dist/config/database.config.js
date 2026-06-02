"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: process.env.NODE_ENV !== 'production',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
}));
//# sourceMappingURL=database.config.js.map