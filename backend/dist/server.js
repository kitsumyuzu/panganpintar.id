"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("tsconfig-paths/register");
const index_1 = require("@/config/index");
const app_1 = __importDefault(require("@/app"));
const PORT = process.env.PORT || 3001;
app_1.default.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║     🚀 Server running on port ${index_1.config.app.port}                  ║
    ║     📚 API Documentation: http://localhost:${index_1.config.app.port}/api-docs  ║
    ╚═══════════════════════════════════════════════════╝
    `);
});
