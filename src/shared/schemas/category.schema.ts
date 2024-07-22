import { zodNotProfaneString } from '@/lib/zod';
import { z } from 'zod';

export const createUpdateCategorySchema = z.object({
  title: zodNotProfaneString(z.string().toLowerCase().trim().min(2).max(30)),
  description: zodNotProfaneString(z.string().trim().max(300)),
});
