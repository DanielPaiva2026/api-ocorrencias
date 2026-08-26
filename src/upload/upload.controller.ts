import { Controller, Post, Get, UseInterceptors, UploadedFile, BadRequestException, Res, Query, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import type { Response } from 'express';
import * as path from 'path';
const archiver = require('archiver');

// Certificar que a pasta uploads existe
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // Retorna a URL relativa que será usada pelo frontend
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    };
  }

  @Get('backup')
  downloadBackup(@Query('pin') pin: string, @Res() res: Response) {
    const globalPin = process.env.ADMIN_PIN || '123456';
    if (pin !== globalPin) {
      throw new UnauthorizedException('PIN inválido');
    }

    const uploadsDir = path.resolve('./uploads');
    if (!fs.existsSync(uploadsDir)) {
      throw new BadRequestException('Pasta de uploads não existe');
    }

    res.attachment('backup_documentos.zip');
    
    const archive = archiver('zip', {
      zlib: { level: 9 } // compressão máxima
    });

    archive.on('error', (err: any) => {
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);
    archive.directory(uploadsDir, false);
    archive.finalize();
  }
}
