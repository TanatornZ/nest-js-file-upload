// file-upload.interceptor.ts
import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, fileFilter } from './multer.config';

@Injectable()
export class FileUploadInterceptor extends FileInterceptor('file', {
  storage: multerConfig.storage,
  fileFilter: (_req, file, callback) => fileFilter({ file }, callback),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}) {}
