import { z } from 'zod';

export const classFormSchema = z.object({
	location: z.string(),
	notes: z.string(),
	streamingLink: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	instructor: z.number(),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;
