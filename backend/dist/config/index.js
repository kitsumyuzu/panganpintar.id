"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const jwtSecret = process.env.JWT_SECRET || 'CHANGE_THIS_IN_PRODUCTION_SECRET_KEY';
exports.config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'panganpintar'
    },
    jwt: {
        secret: jwtSecret,
        expiresIn: process.env.JWT_EXPIRE || '7d'
    },
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    },
    app: {
        port: Number(process.env.PORT) || 3001,
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
    }
};
