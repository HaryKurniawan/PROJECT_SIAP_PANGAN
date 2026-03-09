"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const harga_1 = require("../controllers/harga");
const router = (0, express_1.Router)();
router.get('/', harga_1.getAllHarga);
router.post('/', auth_1.authMiddleware, harga_1.createHarga);
router.put('/:id', auth_1.authMiddleware, harga_1.updateHarga);
router.delete('/:id', auth_1.authMiddleware, harga_1.deleteHarga);
exports.default = router;
//# sourceMappingURL=harga.js.map