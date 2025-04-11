import { StorageClient } from '@supabase/storage-js';

export const supabase = new StorageClient(process.env.SUPABASE_STORAGE_URL!, {
  apikey: process.env.SUPABASE_SERVICE_KEY!,
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
});

export const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME!;
