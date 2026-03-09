"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../controllers/admin");
const router = (0, express_1.Router)();
router.post('/login', admin_1.login);
router.post('/logout', auth_1.authMiddleware, admin_1.logout);
router.get('/stats', auth_1.authMiddleware, admin_1.getStats);
router.get('/me', auth_1.authMiddleware, admin_1.getMe);
exports.default = router;
//# sourceMappingURL=admin.js.map