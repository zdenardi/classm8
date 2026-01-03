import { PrismaClient } from "./generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import process from "node:process";
import { cleanDatabase, seedTestData } from "@/test-utils";

// Use environment variables or defaults
const connectionString =
  `postgresql://postgres:postgres@localhost:5433/classm8_test`;
const adapter = new PrismaPg({ connectionString });

const db = new PrismaClient({ adapter });

async function main() {
  console.log("Starting!");
  await cleanDatabase(db);
  await seedTestData(db);
}

main()
  .then(async () => {
    console.log("Successful!");
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  }).finally(async () => {
    await db.$disconnect();
  });
