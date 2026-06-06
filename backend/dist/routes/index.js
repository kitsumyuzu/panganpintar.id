"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("@/routes/authRoutes"));
const affiliateRoutes_1 = __importDefault(require("@/routes/affiliateRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/affiliate', affiliateRoutes_1.default);
exports.default = router;
