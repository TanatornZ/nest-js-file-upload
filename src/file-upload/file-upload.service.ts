import { Injectable, UploadedFile } from '@nestjs/common';
import { readdirSync, unlinkSync } from 'fs';
import { extname, join } from 'path';
import sharp from 'sharp';

@Injectable()
export class FileUploadService {
  private uploadDir = join(process.cwd(), 'uploads');

  getAllFiles(baseUrl: string): string[] {
    const files = readdirSync(this.uploadDir);
    return files.map((file) => `${baseUrl}/uploads/${file}`);
  }

  async deleteFileByName(fileName: string) {
    try {
      unlinkSync(`${this.uploadDir}/${fileName}`)
      return 'file is deleted';
    } catch {
      return 'fail to delete file';
    }
  }

  async uploadFile(file: Express.Multer.File) {
    // Convert to WebP
    const webpFilename = file.filename.replace(extname(file.filename), '.webp');

    await sharp(file.path)
      .webp({ quality: 80 })
      .toFile(`./uploads/${webpFilename}`)

    // Generate WebP thumbnail
    const thumbnailWebp = `thumb-${webpFilename}`;
    await sharp(file.path)
      .resize(200, 200)
      .webp({ quality: 70 })
      .toFile(`./uploads/${thumbnailWebp}`)

    return {
      webp: `./uploads/${webpFilename}`,
      thumbnail: `./uploads/${thumbnailWebp}`,
    };
  }
}
