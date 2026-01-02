import { createApp } from "../../../../main.ts";
import { cleanDatabase, seedTestData, testDb } from "@/test-utils";

import type { Course, User } from "@/prisma";
import { assertEquals, assertExists } from "@std/assert";
import { CourseWithStudents } from "../../../../../types/course.ts";

let exampleInstructor: User | undefined;
let exampleCourse: Course | undefined;
Deno.test.beforeEach(async () => {
  console.log("Setting up testing data");
  await cleanDatabase();
  const { instructor, course } = await seedTestData();
  exampleInstructor = instructor;
  exampleCourse = course;
});

Deno.test("GET courses", async () => {
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
  const course: CourseWithStudents = body[0];
  assertEquals(course.title, "Test Course");
  assertEquals(course.studentLimit, 10);
  assertEquals(Array.isArray(course.students), true);
  assertEquals(course.students.length, 2);
  testDb.$disconnect();
});

Deno.test("GET course by ID", async () => {
  const app = createApp(testDb);
  assertExists(exampleCourse);
  const request = new Request(
    `http://localhost:8000/api/v1/courses/${exampleCourse.id}`,
    {
      method: "GET",
    },
  );
  const response = await app.handle(request);
  // Assertions
  assertExists(response);
  assertEquals(response.status, 200);

  const course: CourseWithStudents = await response.json();
  assertEquals(course.title, exampleCourse.title);
  assertEquals(course.studentLimit, exampleCourse.studentLimit);
  assertEquals(Array.isArray(course.students), true);
  assertEquals(course.students.length, 2);
  console.log(course);
  testDb.$disconnect();
});

Deno.test("POST courses", async () => {
  assertExists(exampleInstructor);
  const app = createApp(testDb);
  const createdCourse = {
    title: "Test Course",
    studentLimit: 10,
    instructorId: exampleInstructor.id,
  };
  const request = new Request("http://localhost:8000/api/v1/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createdCourse),
  });

  const response = await app.handle(request);
  // Assertions
  assertExists(response);
  assertEquals(response.status, 200);

  testDb.$disconnect();
});

Deno.test("PATCH course by id", async () => {
  const app = createApp(testDb);
  assertExists(exampleCourse);
  assertExists(exampleInstructor);

  const editData = {
    id: exampleCourse.id,
    title: "Edited Course",
    studentLimit: 20,
    instructorId: exampleInstructor.id,
  };
  const request = new Request(
    `http://localhost:8000/api/v1/courses/${exampleCourse.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    },
  );
  const response = await app.handle(request);
  // Assertions
  assertExists(response);
  assertEquals(response.status, 200);

  const course: CourseWithStudents = await response.json();
  console.log(course);
  assertEquals(course.title, editData.title);
  assertEquals(course.studentLimit, editData.studentLimit);
  assertEquals(Array.isArray(course.students), true);
  assertEquals(course.students.length, 2);
  testDb.$disconnect();
});

Deno.test("DELETE course by id", async () => {
  const app = createApp(testDb);
  assertExists(exampleCourse);

  const request = new Request(
    `http://localhost:8000/api/v1/courses/${exampleCourse.id}`,
    {
      method: "DELETE",
    },
  );
  const response = await app.handle(request);
  // Assertions
  assertExists(response);
  console.log(response);
  assertEquals(response.status, 204);

  testDb.$disconnect();
});
