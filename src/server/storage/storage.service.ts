import { BUCKET_NAME, s3 } from '@/lib/s3';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectVersionsCommand,
} from '@aws-sdk/client-s3';

export class StorageService {
  constructor() {}

  async save(file: File): Promise<string> {
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

  async getFile(filename: string) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    });

    const res = await s3.send(command);
    const buffer = await res.Body?.transformToByteArray();

    return buffer;
  }

  async delete(filename: string) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    });

    return s3.send(command);
  }

  async deleteMany(filenames: string[]) {
    await Promise.all(filenames.map(async (filename) => this.delete(filename)));
  }

  async restore(filename: string) {
    const versionId = await this.getDeleteMarkerVersionId(filename);

    if (!versionId) return null;

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      VersionId: versionId,
    });

    return s3.send(command);
  }

  async restoreMany(filenames: string[]) {
    await Promise.all(
      filenames.map(async (filename) => this.restore(filename)),
    );
  }

  private async getDeleteMarkerVersionId(
    filename: string,
  ): Promise<string | null> {
    const command = new ListObjectVersionsCommand({
      Bucket: BUCKET_NAME,
      Prefix: filename,
      MaxKeys: 1,
    });

    const res = await s3.send(command);

    if (res.DeleteMarkers) {
      const deleteMarker = res.DeleteMarkers[0];

      if (deleteMarker.IsLatest && deleteMarker.VersionId) {
        return deleteMarker.VersionId;
      }
    }

    return null;
  }
}
