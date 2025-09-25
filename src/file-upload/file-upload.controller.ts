import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get()
  getAllFiles(@Req() req: Request) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const filePaths = this.fileUploadService.getAllFiles(baseUrl);

    return {
      message: 'get all files success',
      data: filePaths,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { message: 'File uploaded successfully', filePath: file.path };
  }
}
