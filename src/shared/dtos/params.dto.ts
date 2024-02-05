import { z } from 'zod';
import { numericParamsSchema, paramsSchema } from '../schemas/params.schema';

export type Params = z.infer<typeof paramsSchema>;
export type NumericParams = z.infer<typeof numericParamsSchema>;
