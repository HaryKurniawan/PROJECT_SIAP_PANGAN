"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const artikel_1 = require("../controllers/artikel");
const router = (0, express_1.Router)();
router.get('/', artikel_1.getAllArtikel);
router.get('/:id', artikel_1.getArtikelById);
router.post('/', auth_1.authMiddleware, artikel_1.createArtikel);
router.put('/:id', auth_1.authMiddleware, artikel_1.updateArtikel);
router.delete('/:id', auth_1.authMiddleware, artikel_1.deleteArtikel);
exports.default = router;
//# sourceMappingURL=artikel.js.map