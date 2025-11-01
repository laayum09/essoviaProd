import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { unlinkSync } from 'fs';

@Injectable()
export class FilesService {
  private readonly s3: S3Client;
  private readonly bucket = process.env.CLOUDFLARE_R2_BUCKET!;
  private readonly publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL!;

  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadZip(file: Express.Multer.File): Promise<string> {
    try {
      const fileExt = extname(file.originalname);
      const key = `${randomUUID()}${fileExt}`;
      const stream = createReadStream(file.path);

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: stream,
          ContentType: 'application/zip',
        }),
      );

      // Delete local temp file
      unlinkSync(file.path);

      // Construct the public URL (assuming bucket is public)
      return `${this.publicUrl}/${key}`;
    } catch (err) {
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async deleteFile(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}