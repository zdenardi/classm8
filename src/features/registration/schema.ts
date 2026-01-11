import { z } from 'zod';

export const registrationFormSchema = z.object({
	email: z.email('This is not a valid email.'),
	firstName: z.string(),
	lastName: z.string(),
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
