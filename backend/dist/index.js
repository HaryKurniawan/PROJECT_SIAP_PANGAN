"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const apiKey_1 = require("./middleware/apiKey");
const laporan_1 = __importDefault(require("./routes/laporan"));
const harga_1 = __importDefault(require("./routes/harga"));
const artikel_1 = __importDefault(require("./routes/artikel"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
// API Key protection
app.use('/api', apiKey_1.apiKeyMiddleware);
// Static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// Routes
app.use('/api/laporan', laporan_1.default);
app.use('/api/harga', harga_1.default);
app.use('/api/artikel', artikel_1.default);
app.use('/api/admin', admin_1.default);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'SIAP PANGAN BREBES API is running' });
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
});
app.listen(PORT, () => {
    console.log(`🚀 SIAP PANGAN BREBES API running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map