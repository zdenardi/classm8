import { Router } from "@oak/oak";
import courseRouter from "./courses/course.ts";
import classRouter from "./class/class.ts";

const router = new Router({ prefix: "/api/v1" });
const ROUTERS = [courseRouter, classRouter];

ROUTERS.forEach((r) => {
  router.use(r.routes());
  router.use(r.allowedMethods());
});

export default router;
