import { Router } from "@oak/oak";
import coursesRouter from "./courses/courses.ts";

const router = new Router({ prefix: "/api/v1" });
router.use(coursesRouter.routes());
router.use(coursesRouter.allowedMethods());

export default router;
