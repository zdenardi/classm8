import { superoak } from "https://deno.land/x/superoak@4.8.1/mod.ts";
import { createApp } from "../../../../main.ts";
import {
  testPrisma,
  cleanDatabase,
  seedTestData,
} from "../../../../util/test/utils.ts";
import { assert } from "node:console";

Deno.test("GET /courses", async () => {
  await seedTestData();
  const app = createApp(testPrisma);
  const request = await superoak(app);
  await request
    .get("/api/v1.courses")
    .expect(200)
    .expect("Content-Type", /json/)
    .expect({ ok: true });
});
