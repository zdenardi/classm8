import { createApp } from "../../../../main.ts";
import { cleanDatabase, seedTestData, testDb } from "@/test-utils";

import type { Class, Course } from "@/prisma";
import { assertEquals, assertExists } from "@std/assert";
import { ClassWithCourseAndScenes } from "../../../../../types/class.ts";

let exampleClass: Class | undefined;
let exampleCourse: Course | undefined;

Deno.test.beforeEach(async () => {
  console.log("Setting up testing data");
  await cleanDatabase();
  const { actingClass, course } = await seedTestData();
  exampleClass = actingClass;
  exampleCourse = course;
});

Deno.test.afterEach(async () => {
  await testDb.$disconnect;
});

Deno.test("GET classes", async () => {
  const app = createApp(testDb);
  const request = new Request("http://localhost:8000/api/v1/classes", {
    method: "GET",
  });
  const response = await app.handle(request);
  // Assertions
  assertExists(response);
  assertExists(exampleClass);
  assertEquals(response.status, 200);

  const body = await response.json();
  assertEquals(Array.isArray(body), true);
  const actingClass: ClassWithCourseAndScenes = body[0];
  assertEquals(actingClass.id, exampleClass.id);

  testDb.$disconnect();
});

Deno.test("GET class by id", async () => {
  const app = createApp(testDb);
  const request = new Request(
    `http://localhost:8000/api/v1/classes/${exampleClass?.id}`,
    {
      method: "GET",
    }
  );
  const response = await app.handle(request);
  // Assertions
  assertExists(response);
  assertExists(exampleClass);
  assertEquals(response.status, 200);

  const actingClass: ClassWithCourseAndScenes = await response.json();
  assertEquals(actingClass.id, exampleClass.id);
  console.log(actingClass);

  testDb.$disconnect();
});

Deno.test("POST classes", async () => {
  assertExists(exampleCourse);
  const app = createApp(testDb);
  const createdClass = {
    courseId: exampleCourse.id,
    location: "Some place",
    notes: "Here are some notes",
    startDate: new Date("2025-01-01T18:00:00"),
    endDate: new Date("2025-01-01T21:00:00"),
    streamingLink: "",
  };
  const request = new Request("http://localhost:8000/api/v1/classes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createdClass),
  });

  const response = await app.handle(request);
  // Assertions
  assertExists(response);
  assertEquals(response.status, 200);

  testDb.$disconnect();
});

Deno.test("PATCH class by id", async () => {
  assertExists(exampleClass);
  assertExists(exampleCourse);
  const app = createApp(testDb);
  const data = {
    id: exampleClass.id,
    courseId: exampleCourse.id,
    location: "Some place",
    notes: "Here are some notes",
    startDate: new Date("2025-01-02T18:00:00").toISOString(),
    endDate: new Date("2025-01-02T21:00:00").toISOString(),
    streamingLink: "zoomLink",
  };
  const request = new Request(
    `http://localhost:8000/api/v1/classes/${exampleClass?.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const response = await app.handle(request);
  // Assertions
  assertExists(response);
  assertEquals(response.status, 200);

  const actingClass: ClassWithCourseAndScenes = await response.json();
  assertEquals(actingClass.id, exampleClass.id);
  assertEquals(actingClass.streamingLink, data.streamingLink);

  testDb.$disconnect();
});

Deno.test("DELETE class by id", async () => {
  assertExists(exampleClass);
  const app = createApp(testDb);

  const request = new Request(
    `http://localhost:8000/api/v1/classes/${exampleClass?.id}`,
    {
      method: "DELETE",
    }
  );
  const response = await app.handle(request);
  // Assertions
  assertExists(response);
  assertEquals(response.status, 204);

  testDb.$disconnect();
});
