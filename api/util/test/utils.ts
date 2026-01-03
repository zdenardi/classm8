import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/client.ts";

const connectionString =
  `postgresql://postgres:postgres@localhost:5433/classm8_test`;
const adapter = new PrismaPg({ connectionString });
export const testDb = new PrismaClient({ adapter });

export async function cleanDatabase(db: PrismaClient = testDb) {
  try {
    await db.scenesInClasses.deleteMany();
    await db.usersAndScenes.deleteMany();
    await db.usersInCourses.deleteMany();
    await db.scene.deleteMany();
    await db.class.deleteMany();
    await db.course.deleteMany();
    await db.user.deleteMany();
  } catch (e) {
    console.log(e);
  }
}

export async function seedTestData(db: PrismaClient = testDb) {
  const instructor = await db.user.create({
    data: {
      email: "instructor@test.com",
      firstName: "John",
      lastName: "Doe",
      role: "INSTRUCTOR",
    },
  });

  const student1 = await db.user.create({
    data: {
      email: "student1@email.com",
      firstName: "Student1",
      lastName: "Uno",
      role: "STUDENT",
    },
  });

  const student2 = await db.user.create({
    data: {
      email: "student2@email.com",
      firstName: "Student2",
      lastName: "Dos",
      role: "STUDENT",
    },
  });

  const scene = await db.scene.create({
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

  const course = await db.course.create({
    data: {
      title: "Test Course",
      studentLimit: 10,
      instructorId: instructor.id,
      students: {
        create: [{ userId: student1.id }, { userId: student2.id }],
      },
    },
  });

  const actingClass = await db.class.create({
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
