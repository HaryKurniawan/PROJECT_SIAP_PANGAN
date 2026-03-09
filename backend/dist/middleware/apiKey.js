"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyMiddleware = apiKeyMiddleware;
/**
 * API Key middleware — validates x-api-key header
 */
function apiKeyMiddleware(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.API_KEY;
    if (!validKey)
        return next(); // dev mode: skip if not set
    if (!apiKey) {
        res.status(403).json({ success: false, message: 'Akses ditolak. API key tidak ditemukan.' });
        return;
    }
    if (apiKey !== validKey) {
        res.status(403).json({ success: false, message: 'Akses ditolak. API key tidak valid.' });
        return;
    }
    next();
}
//# sourceMappingURL=apiKey.js.map