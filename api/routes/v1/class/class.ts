import { Router } from "@oak/oak";
import { Class, PrismaClient } from "@/prisma";
import { clerkAuth } from "../../../middleware/clerkAuth.ts";

const classRouter = new Router();

classRouter.get("/classes", clerkAuth, async (context) => {
  const db = context.app.state.prisma;
  const classes = await db.class.findMany({
    include: {
      course: {
        include: {
          instructor: true,
        },
      },
      scenes: {
        include: { scene: true },
      },
    },
  });
  context.response.body = classes;
});

classRouter.get("/classes/:id", async (context) => {
  const db = context.app.state.prisma;
  const { id } = context.params;
  const foundClass = await db.class.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      course: {
        include: {
          instructor: true,
        },
      },
      scenes: {
        include: { scene: true },
      },
    },
  });
  context.response.body = foundClass;
});

classRouter.post("/classes", async (context) => {
  const db = context.app.state.prisma;
  const data: Omit<Class, "id" | "createdAt" | "updatedAt"> = await context
    .request.body.json();
  const createdClass = await db.class.create({ data });
  context.response.body = createdClass;
});

classRouter.patch("/classes/:id", async (context) => {
  const db: PrismaClient = context.app.state.prisma;
  const data: Partial<Class> = await context.request.body.json();
  const { id } = context.params;
  const updatedClass = await db.class.update({
    where: {
      id: Number(id),
    },
    data,
    include: {
      course: {
        include: {
          instructor: true,
        },
      },
      scenes: {
        include: { scene: true },
      },
    },
  });
  context.response.body = updatedClass;
});

classRouter.delete("/classes/:id", async (context) => {
  const db: PrismaClient = context.app.state.prisma;
  const { id } = context.params;
  await db.class.delete({
    where: {
      id: Number(id),
    },
  });
  context.response.status = 204;
});

export default classRouter;
