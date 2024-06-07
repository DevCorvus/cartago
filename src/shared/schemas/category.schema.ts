import { zodNotProfaneString } from '@/lib/zod';
import { z } from 'zod';

export const createUpdateCategorySchema = z.object({
  title: zodNotProfaneString(z.string().min(2).max(30).trim().toLowerCase()),
  description: zodNotProfaneString(z.string().max(300).trim()),
});
