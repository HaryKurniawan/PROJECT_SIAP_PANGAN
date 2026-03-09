"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = login;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ success: false, message: 'Username dan password wajib.' });
            return;
        }
        const admin = await prisma.admin.findUnique({ where: { username } });
        if (!admin) {
            res.status(401).json({ success: false, message: 'Username atau password salah.' });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(password, admin.password);
        if (!isValid) {
            res.status(401).json({ success: false, message: 'Username atau password salah.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, username: admin.username, nama: admin.nama }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        });
        res.json({
            success: true,
            message: 'Login berhasil!',
            data: { admin: { id: admin.id, username: admin.username, nama: admin.nama } },
        });
    }
    catch (error) {
        console.error('Error login:', error);
        res.status(500).json({ success: false, message: 'Gagal login.' });
    }
}
//# sourceMappingURL=login.js.map