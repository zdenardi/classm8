-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT', 'MODERATOR', 'INSTRUCTOR');

-- CreateEnum
CREATE TYPE "SceneTypes" AS ENUM ('PLAY', 'FILM', 'MONOLOGUE', 'SONG', 'TELEVISION', 'OTHER');

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "studentLimit" INTEGER,
    "instructorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "streamingLink" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scene" (
    "id" SERIAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" "SceneTypes" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonsInCourses" (
    "personId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "hasPaid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PersonsInCourses_pkey" PRIMARY KEY ("personId","courseId")
);

-- CreateTable
CREATE TABLE "PersonsAndScenes" (
    "personId" INTEGER NOT NULL,
    "sceneId" INTEGER NOT NULL,

    CONSTRAINT "PersonsAndScenes_pkey" PRIMARY KEY ("personId","sceneId")
);

-- CreateTable
CREATE TABLE "ScenesInClasses" (
    "classId" INTEGER NOT NULL,
    "sceneId" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL,

    CONSTRAINT "ScenesInClasses_pkey" PRIMARY KEY ("classId","sceneId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonsInCourses" ADD CONSTRAINT "PersonsInCourses_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonsInCourses" ADD CONSTRAINT "PersonsInCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonsAndScenes" ADD CONSTRAINT "PersonsAndScenes_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonsAndScenes" ADD CONSTRAINT "PersonsAndScenes_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenesInClasses" ADD CONSTRAINT "ScenesInClasses_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenesInClasses" ADD CONSTRAINT "ScenesInClasses_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
