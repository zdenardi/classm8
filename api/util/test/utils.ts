import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/client.ts";
import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://postgres:postgres@localhost:5433/classm8_test`;
const adapter = new PrismaPg({ connectionString });
export const testDb = new PrismaClient({ adapter });

export async function cleanDatabase() {
  await testDb.scenesInClasses.deleteMany();
  await testDb.personsAndScenes.deleteMany();
  await testDb.personsInCourses.deleteMany();
  await testDb.scene.deleteMany();
  await testDb.class.deleteMany();
  await testDb.course.deleteMany();
  await testDb.person.deleteMany();
}

export async function seedTestData() {
  const instructor = await testDb.person.create({
    data: {
      email: "instructor@test.com",
      firstName: "John",
      lastName: "Doe",
      role: "INSTRUCTOR",
    },
  });

  const course = await testDb.course.create({
    data: {
      title: "Test Course",
      studentLimit: 10,
      instructorId: instructor.id,
    },
  });

  return { instructor, course };
}

export function createTestApp() {}
