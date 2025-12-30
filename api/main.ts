import { Application, Context, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import { clerkMiddleware } from "@clerk/express";
export const app = new Application();
const router = new Router();

const PORT = 8000;
app.use(oakCors());
app.use(clerkMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([`${Deno.cwd()}/dist`, `${Deno.cwd()}/public`]));

if (import.meta.main) {
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: PORT });
}
