"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genNumericId = genNumericId;
exports.genBase36Id = genBase36Id;
function genNumericId(len) {
    let out = '';
    while (out.length < len)
        out += Math.floor(Math.random() * 10);
    return out;
}
function genBase36Id(len) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let out = '';
    for (let i = 0; i < len; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}
//# sourceMappingURL=id.util.js.map