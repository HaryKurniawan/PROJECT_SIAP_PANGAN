"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getMe;
async function getMe(req, res) {
    res.json({ success: true, data: req.admin });
}
//# sourceMappingURL=getMe.js.map