import { Injectable } from '@nestjs/common';
import { readdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  getAllFiles(baseUrl: string): string[] {
    const uploadDir = join(process.cwd(), 'uploads');
    const files = readdirSync(uploadDir);

    return files.map((file) => `${baseUrl}/uploads/${file}`);
  }
}
