import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client.ts";

const connectionString = `postgresql://postgres:postgres@localhost:5433/classm8_test`;
const adapter = new PrismaPg({ connectionString });
export const db = new PrismaClient({ adapter });
