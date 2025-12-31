import { Router } from "@oak/oak";
import { Course } from "@/prisma";
import { request } from "node:http";

const coursesRouter = new Router();

coursesRouter.get("/courses", async (context) => {
  const db = context.app.state.prisma;
  const courses = await db.course.findMany({
    include: {
      students: {
        include: { person: true },
      },
    },
  });
  context.response.body = courses;
});

coursesRouter.get("/courses/:id", async (context) => {
  const db = context.app.state.prisma;
  const { id } = context.params;
  const courses = await db.course.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      students: {
        include: { person: true },
      },
    },
  });
  context.response.body = courses;
});

coursesRouter.post("/courses", async (context) => {
  const data: Omit<Course, "id" | "createdAt" | "updatedAt"> =
    await context.request.body.json();
  console.log(data);
  const db = context.app.state.prisma;
  const createdCourse = await db.course.create({
    data,
  });
  context.response.body = createdCourse;
});

export default coursesRouter;
