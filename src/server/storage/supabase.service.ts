import { BUCKET_NAME, supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export class StorageService {
  constructor() {}

  async save(file: File): Promise<string> {
    const filetype = file.type.split('/')[1];
    const filename = `${nanoid()}.${filetype}`;

    await supabase.from(BUCKET_NAME).upload(filename, file);

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
    const { data, error } = await supabase.from(BUCKET_NAME).download(filename);

    if (error) throw error;

    const buffer = new Uint8Array(await data.arrayBuffer());

    return buffer;
  }

  async delete(filename: string) {
    const { error } = await supabase.from(BUCKET_NAME).remove([filename]);
    return Boolean(error);
  }

  async deleteMany(filenames: string[]) {
    const { error } = await supabase.from(BUCKET_NAME).remove(filenames);
    return Boolean(error);
  }
}
