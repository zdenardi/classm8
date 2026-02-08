import { z } from 'zod';

export const courseFormSchema = z.object({
	title: z.string(),
	studentLimit: z.number(),
	instructorId: z.number(),
	startDate: z.string(),
	endDate: z.string(),
	location: z.string(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
