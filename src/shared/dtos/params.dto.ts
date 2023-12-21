import { z } from 'zod';
import { paramsSchema } from '../schemas/params.schema';

export type Params = z.infer<typeof paramsSchema>;
