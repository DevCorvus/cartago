import { z } from 'zod';
import { createUpdateCategorySchema } from '../schemas/category.schema';

export type CreateUpdateCategoryDto = z.infer<
  typeof createUpdateCategorySchema
>;
