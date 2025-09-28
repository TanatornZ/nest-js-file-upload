import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ModuleHttpExceptionFilter } from '../common/module-exception.filter';

@Controller('file-upload')
@UseFilters(new ModuleHttpExceptionFilter())
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
    try {
      if (!file) {
        throw new BadRequestException(
          'No image uploaded. Please provide a file.',
        );
      }

      const { thumbnail, webp } = await this.fileUploadService.uploadFile(file);
      return {
        message: 'File uploaded successfully',
        filePath: { original: `./uploads/${file.filename}`, thumbnail, webp },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        // Pass through validation errors
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Delete(':fileName')
  deleteFileByName(@Param('fileName') fileName: string) {
    const deleteFile = this.fileUploadService.deleteFileByName(fileName);
    return { message: deleteFile };
  }
}
