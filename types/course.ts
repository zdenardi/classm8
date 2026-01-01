import { Prisma } from "@/prisma";

export type CourseWithStudents = Prisma.CourseGetPayload<{
  include: { students: true };
}>;
