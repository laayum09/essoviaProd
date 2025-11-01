export declare class FilesService {
    private readonly s3;
    private readonly bucket;
    private readonly publicUrl;
    constructor();
    uploadZip(file: Express.Multer.File): Promise<string>;
    deleteFile(key: string): Promise<void>;
}
