import { z } from 'zod';
import { USER_TYPES } from './constants.ts';

export const userFormSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	type: z.enum(USER_TYPES),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
