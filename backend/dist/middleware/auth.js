"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * JWT auth via HTTP-only cookie
 */
function authMiddleware(req, res, next) {
    const token = req.cookies?.admin_token;
    if (!token) {
        res.status(401).json({ success: false, message: 'Akses ditolak. Silakan login terlebih dahulu.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    }
    catch {
        res.clearCookie('admin_token');
        res.status(401).json({ success: false, message: 'Sesi telah berakhir. Silakan login kembali.' });
    }
}
//# sourceMappingURL=auth.js.map