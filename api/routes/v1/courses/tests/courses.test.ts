import { createApp } from "../../../../main.ts";
import { testDb, seedTestData, cleanDatabase } from "@/test-utils";

import type { Course } from "@/prisma";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("GET /courses", async () => {
  await cleanDatabase();
  await seedTestData();
  const app = createApp(testDb);
  const request = new Request("http://localhost:8000/api/v1/courses", {
    method: "GET",
  });
  const response = await app.handle(request);
  // Assertions
  assertExists(response);
  assertEquals(response.status, 200);

  const body = await response.json();
  assertEquals(Array.isArray(body), true);
  const course: Course = body[0];
  assertEquals(course.title, "Test Course");
  assertEquals(course.studentLimit, 10);
  testDb.$disconnect();
});
