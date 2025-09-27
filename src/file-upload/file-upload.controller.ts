import {
  Controller,
  Delete,
  Get,
  Param,
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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { thumbnail, webp } = await this.fileUploadService.uploadFile(file);
    return {
      message: 'File uploaded successfully',
      filePath: { original: `./uploads/${file.filename}`, thumbnail, webp },
    };
  }

  @Delete(':fileName')
  deleteFileByName(@Param('fileName') fileName: string) {
    const deleteFile = this.fileUploadService.deleteFileByName(fileName);
    return { message: deleteFile };
  }
}
