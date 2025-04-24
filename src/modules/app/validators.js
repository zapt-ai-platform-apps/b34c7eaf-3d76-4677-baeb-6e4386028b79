import { z } from 'zod';
import { createValidator } from '../core/validators';

// App state validator
export const appStateSchema = z.object({
  initialized: z.boolean(),
  currentPage: z.string().optional()
});

export const validateAppState = createValidator(appStateSchema, 'AppState');