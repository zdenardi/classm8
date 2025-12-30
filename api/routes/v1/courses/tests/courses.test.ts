import { createApp } from "../../../../main.ts";
import {
  testDb,
  cleanDatabase,
  seedTestData,
} from "../../../../util/test/utils.ts";
import { assertEquals } from "@std/assert";

Deno.test("GET /courses", async () => {
  await cleanDatabase();
  await seedTestData();
  const app = createApp(testDb);
  const request = new Request("http://localhost:8000/api/v1/courses", {
    method: "GET",
  });
  const response = await app.handle(request);
  // Assertions
  assertEquals(response.status, 200);

  const body = await response.json();
  console.log(body);
  // Assert on the actual response body structure
  assertEquals(Array.isArray(body), true);
  testDb.$disconnect();
});
