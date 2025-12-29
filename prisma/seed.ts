import { PrismaClient } from "./generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import process from "node:process";

const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  database: "template1",
  user: "postgres",
  password: "postgres",
  ssl: false,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminUser = await prisma.person.upsert({
    where: { email: "test@email.com" },
    update: {},
    create: {
      email: "test@gmail.com",
      firstName: "Test",
      lastName: "User",
      role: "ADMIN",
    },
  });
  console.log(adminUser);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
