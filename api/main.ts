import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import router from "./routes/v1/index.ts";
import { db } from "./db.ts";
import { PrismaClient } from "../prisma/generated/client.ts";

/**
 * Creates app
 * @param db
 * @returns
 */
export function createApp(db: PrismaClient) {
  const app = new Application();

  app.state.prisma = db;
  app.use(oakCors());
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(routeStaticFilesFrom([`${Deno.cwd()}/dist`, `${Deno.cwd()}/public`]));
  return app;
}

const PORT = 8000;

if (import.meta.main) {
  const app = createApp(db);
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: PORT });
}
