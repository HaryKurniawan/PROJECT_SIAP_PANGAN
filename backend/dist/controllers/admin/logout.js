"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = logout;
async function logout(_req, res) {
    res.clearCookie('admin_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    res.json({ success: true, message: 'Logout berhasil.' });
}
//# sourceMappingURL=logout.js.map