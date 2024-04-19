import { isProfane } from '@/utils/isProfane';
import { ZodString } from 'zod';

export function zodNotProfaneString(zodString: ZodString) {
  return zodString.refine(
    (text) => !isProfane(text),
    'Do not use profane words',
  );
}
