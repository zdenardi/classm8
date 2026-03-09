import { z } from 'zod';

export const courseFormSchema = z.object({
	title: z.string(),
	startDate: z.string(),
	startTime: z.string(), // Time when class starts (e.g., "18:00")
	endTime: z.string(), // Time when class ends (e.g., "21:00")
	location: z.string(),
	repeatNum: z.number(),
	instructorId: z.number(),
	studentLimit: z.number().optional(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
