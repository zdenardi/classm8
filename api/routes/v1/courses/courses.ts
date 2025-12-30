import { Router } from "@oak/oak";

const coursesRouter = new Router();

coursesRouter.get("/courses", async (context) => {
  const db = context.app.state.prisma;
  const courses = await db.course.findMany();
  context.response.body = courses;
});

export default coursesRouter;
