import { BUCKET_NAME, s3 } from '@/lib/s3';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

export class StorageService {
  constructor() {}

  private async save(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
    });

    await s3.send(command);

    return filename;
  }

  async getFile(filename: string) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    });

    const res = await s3.send(command);
    const buffer = await res.Body?.transformToByteArray();

    return buffer;
  }

  async saveMany(data: File[]): Promise<string[]> {
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
        this.deleteMany(filenames);
      } catch (err2) {
        throw err2;
      }
      throw err1;
    }

    return filenames;
  }

  async deleteMany(filenames: string[]) {
    await Promise.all(
      filenames.map(async (filename) => {
        const command = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filename,
        });
        return s3.send(command);
      }),
    );
  }
}
