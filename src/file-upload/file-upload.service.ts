import { Injectable } from '@nestjs/common';
import { readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

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
}
