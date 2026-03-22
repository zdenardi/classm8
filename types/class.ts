import { Prisma } from '@/prisma';

export type ClassWithCourseAndScenes = Prisma.ClassGetPayload<{
	include: { course: true; scenes: true };
}>;

export type ClassWithCourseAndScenesAndAttendance = Prisma.ClassGetPayload<{
	include: { course: true; scenes: true; attendances: true };
}>;
