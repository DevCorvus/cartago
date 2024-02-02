import { existsSync } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';

export class StorageService {
  private outDir: string;
  private outDirExists: boolean;

  constructor(outDir: string) {
    this.outDir = path.join(process.cwd(), outDir);
    this.outDirExists = false;
  }

  private async initOutDir() {
    if (!existsSync(this.outDir)) {
      await mkdir(this.outDir);
    }
    this.outDirExists = true;
  }

  private async save(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;

    await writeFile(path.join(this.outDir, filename), buffer);

    return filename;
  }

  async saveMany(data: File[]): Promise<string[]> {
    if (!this.outDirExists) {
      this.initOutDir();
    }

    const filenames: string[] = [];

    try {
      await Promise.all(
        data.map(async (file) => {
          const filename = await this.save(file);
          filenames.push(filename);
        }),
      );
    } catch (err1) {
      try {
        await Promise.all(
          filenames.map(async (filename) => {
            await unlink(path.join(this.outDir, filename));
          }),
        );
      } catch (err2) {
        throw err2;
      }
      throw err1;
    }

    return filenames;
  }
}
