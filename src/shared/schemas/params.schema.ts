import { z } from 'zod';

export const paramsSchema = z.object({
  id: z.string().uuid(),
});

export const numericParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const idsArrayFromSeachParamsSchema = z
  .string()
  .transform((str) => JSON.parse(str))
  .pipe(z.array(z.string().uuid()));
