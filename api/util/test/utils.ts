import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/client.ts";
import process from "node:process";

const connectionString = `postgresql://postgres:postgres@localhost:5433/classm8_test`;
const adapter = new PrismaPg({ connectionString });
export const testDb = new PrismaClient({ adapter });

export async function cleanDatabase() {
  try {
    await testDb.scenesInClasses.deleteMany();
    await testDb.usersAndScenes.deleteMany();
    await testDb.usersInCourses.deleteMany();
    await testDb.scene.deleteMany();
    await testDb.class.deleteMany();
    await testDb.course.deleteMany();
    await testDb.user.deleteMany();
  } catch (e) {
    console.log(e);
  }
}

export async function seedTestData() {
  const instructor = await testDb.user.create({
    data: {
      email: "instructor@test.com",
      firstName: "John",
      lastName: "Doe",
      role: "INSTRUCTOR",
    },
  });

  const student1 = await testDb.user.create({
    data: {
      email: "student1@email.com",
      firstName: "Student1",
      lastName: "Uno",
      role: "STUDENT",
    },
  });

  const student2 = await testDb.user.create({
    data: {
      email: "student2@email.com",
      firstName: "Student2",
      lastName: "Dos",
      role: "STUDENT",
    },
  });

  const scene = await testDb.scene.create({
    data: {
      duration: 10,
      title: "A Fake Scene",
      type: "PLAY",
      notes: "A fake play",
      performers: {
        create: [{ userId: student1.id }, { userId: student2.id }],
      },
    },
  });

  const course = await testDb.course.create({
    data: {
      title: "Test Course",
      studentLimit: 10,
      instructorId: instructor.id,
      students: {
        create: [{ userId: student1.id }, { userId: student2.id }],
      },
    },
  });

  const actingClass = await testDb.class.create({
    data: {
      courseId: course.id,
      location: "Some place",
      notes: "Here are some notes",
      startDate: new Date("2025-01-01T18:00:00"),
      endDate: new Date("2025-01-01T21:00:00"),
      streamingLink: "",
      scenes: {
        create: { sceneId: scene.id, order: 1 },
      },
    },
  });

  return { instructor, course, actingClass, student1, student2, scene };
}

export function createTestApp() {}
