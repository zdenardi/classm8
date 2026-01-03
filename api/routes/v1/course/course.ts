import { Router } from "@oak/oak";
import { Course, PrismaClient } from "@/prisma";

const courseRouter = new Router();

courseRouter.get("/courses", async (context) => {
  const db = context.app.state.prisma;
  const courses = await db.course.findMany({
    include: {
      students: {
        include: { user: true },
      },
    },
  });
  context.response.body = courses;
});

courseRouter.get("/courses/:id", async (context) => {
  const db = context.app.state.prisma;
  const { id } = context.params;
  const courses = await db.course.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      students: {
        include: { user: true },
      },
    },
  });
  context.response.body = courses;
});

courseRouter.post("/courses", async (context) => {
  const data: Omit<Course, "id" | "createdAt" | "updatedAt"> =
    await context.request.body.json();
  const db = context.app.state.prisma;
  const createdCourse = await db.course.create({
    data,
  });
  context.response.body = createdCourse;
});

courseRouter.patch("/courses/:id", async (context) => {
  const id = await context.params.id;
  const data: Course = await context.request.body.json();
  const db: PrismaClient = context.app.state.prisma;

  if (parseInt(id) != data.id) {
    context.response.status = 400;
  }

  const updatedCourse = await db.course.update({
    where: {
      id: data.id,
    },
    data,
    include: {
      instructor: true,
      students: {
        include: {
          user: true,
        },
      },
      classes: {
        include: {
          scenes: {
            include: {
              scene: true,
            },
          },
        },
      },
    },
  });
  return (context.response.body = updatedCourse);
});

courseRouter.delete("/courses/:id", async (context) => {
  const id = await context.params.id;
  const db: PrismaClient = context.app.state.prisma;

  await db.course.delete({
    where: {
      id: Number(id),
    },
  });
  context.response.status = 204;
});

export default courseRouter;
