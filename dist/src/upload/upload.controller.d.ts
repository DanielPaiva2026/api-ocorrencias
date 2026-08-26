import type { Response } from 'express';
export declare class UploadController {
    uploadFile(file: Express.Multer.File): {
        url: string;
        filename: string;
    };
    downloadBackup(pin: string, res: Response): void;
}
