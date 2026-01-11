/*
  Warnings:

  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonsAndScenes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonsInCourses` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[order]` on the table `ScenesInClasses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `ScenesInClasses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "PersonsAndScenes" DROP CONSTRAINT "PersonsAndScenes_personId_fkey";

-- DropForeignKey
ALTER TABLE "PersonsAndScenes" DROP CONSTRAINT "PersonsAndScenes_sceneId_fkey";

-- DropForeignKey
ALTER TABLE "PersonsInCourses" DROP CONSTRAINT "PersonsInCourses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "PersonsInCourses" DROP CONSTRAINT "PersonsInCourses_personId_fkey";

-- DropForeignKey
ALTER TABLE "ScenesInClasses" DROP CONSTRAINT "ScenesInClasses_classId_fkey";

-- DropForeignKey
ALTER TABLE "ScenesInClasses" DROP CONSTRAINT "ScenesInClasses_sceneId_fkey";

-- AlterTable
ALTER TABLE "ScenesInClasses" ADD COLUMN     "order" INTEGER NOT NULL,
ALTER COLUMN "approved" SET DEFAULT false;

-- DropTable
DROP TABLE "Person";

-- DropTable
DROP TABLE "PersonsAndScenes";

-- DropTable
DROP TABLE "PersonsInCourses";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "clerkId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInCourses" (
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "hasPaid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UsersInCourses_pkey" PRIMARY KEY ("userId","courseId")
);

-- CreateTable
CREATE TABLE "UsersAndScenes" (
    "userId" INTEGER NOT NULL,
    "sceneId" INTEGER NOT NULL,

    CONSTRAINT "UsersAndScenes_pkey" PRIMARY KEY ("userId","sceneId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "ScenesInClasses_order_key" ON "ScenesInClasses"("order");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInCourses" ADD CONSTRAINT "UsersInCourses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInCourses" ADD CONSTRAINT "UsersInCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersAndScenes" ADD CONSTRAINT "UsersAndScenes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersAndScenes" ADD CONSTRAINT "UsersAndScenes_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenesInClasses" ADD CONSTRAINT "ScenesInClasses_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenesInClasses" ADD CONSTRAINT "ScenesInClasses_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE CASCADE ON UPDATE CASCADE;
