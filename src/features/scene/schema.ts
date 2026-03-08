import { z } from 'zod';
import { SceneTypes } from '../../../prisma/generated/enums.ts';

export const sceneFormSchema = z.object({
	title: z.string(),
	type: z.enum(SceneTypes),
	duration: z.number(), // in minutes
	performerIDs: z.array(z.number()).optional(), // Could be a monologue
	classID: z.string(),
	notes: z.string().optional(),
});

export type SceneFormValues = z.infer<typeof sceneFormSchema>;
