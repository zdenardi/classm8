import { Prisma } from "@/prisma";

export type ClassWithCourseAndScenes = Prisma.ClassGetPayload<{
  include: { course: true; scenes: true };
}>;
