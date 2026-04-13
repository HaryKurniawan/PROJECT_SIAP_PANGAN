"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = require("../middleware/auth");
const admin_1 = require("../controllers/admin");
const router = (0, express_1.Router)();
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Terlalu banyak percobaan login, silakan coba lagi dalam 15 menit.' },
    standardHeaders: true,
    legacyHeaders: false,
});
router.post('/login', loginLimiter, admin_1.login);
router.post('/logout', auth_1.authMiddleware, admin_1.logout);
router.get('/stats', auth_1.authMiddleware, admin_1.getStats);
router.get('/me', auth_1.authMiddleware, admin_1.getMe);
exports.default = router;
//# sourceMappingURL=admin.js.map