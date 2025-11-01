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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = require("crypto");
const fs_2 = require("fs");
let FilesService = class FilesService {
    s3;
    bucket = process.env.CLOUDFLARE_R2_BUCKET;
    publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
    constructor() {
        this.s3 = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
            },
        });
    }
    async uploadZip(file) {
        try {
            const fileExt = (0, path_1.extname)(file.originalname);
            const key = `${(0, crypto_1.randomUUID)()}${fileExt}`;
            const stream = (0, fs_1.createReadStream)(file.path);
            await this.s3.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: stream,
                ContentType: 'application/zip',
            }));
            (0, fs_2.unlinkSync)(file.path);
            return `${this.publicUrl}/${key}`;
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('File upload failed');
        }
    }
    async deleteFile(key) {
        await this.s3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FilesService);
//# sourceMappingURL=files.service.js.map