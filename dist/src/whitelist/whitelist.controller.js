"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhitelistController = void 0;
const common_1 = require("@nestjs/common");
const whitelist_service_1 = require("./whitelist.service");
let WhitelistController = class WhitelistController {
    whitelist;
    constructor(whitelist) {
        this.whitelist = whitelist;
    }
    async setup(body) {
        return this.whitelist.setup(body.databaseid, body.productid, body.type, body.userid);
    }
    async auth(body) {
        return this.whitelist.auth(body.databaseid, body.productid, body.whitelistid);
    }
    async list(databaseId) {
        return this.whitelist.listForUser(databaseId);
    }
    async revoke(whitelistId) {
        return this.whitelist.revoke(whitelistId);
    }
};
exports.WhitelistController = WhitelistController;
__decorate([
    (0, common_1.Post)('setup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhitelistController.prototype, "setup", null);
__decorate([
    (0, common_1.Post)('auth'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhitelistController.prototype, "auth", null);
__decorate([
    (0, common_1.Get)(':databaseId'),
    __param(0, (0, common_1.Param)('databaseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhitelistController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)(':whitelistId'),
    __param(0, (0, common_1.Param)('whitelistId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhitelistController.prototype, "revoke", null);
exports.WhitelistController = WhitelistController = __decorate([
    (0, common_1.Controller)('whitelist'),
    __metadata("design:paramtypes", [whitelist_service_1.WhitelistService])
], WhitelistController);
//# sourceMappingURL=whitelist.controller.js.map