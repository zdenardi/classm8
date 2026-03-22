import { createApp } from '../../../../main.ts';
import { cleanDatabase, seedTestData, testDb } from '@/test-utils';
import type { Class, Course, User } from '@/prisma';
import { assertEquals, assertExists } from '@std/assert';
import { ClassWithCourseAndScenes } from '../../../../../types/class.ts';
import { db } from '@/db';
import { authConfig } from '../../../../middleware/clerkAuth.ts';

let exampleClass: Class | undefined;
let exampleCourse: Course | undefined;
let exampleStudent: User | undefined;

Deno.test.beforeEach(async () => {
	console.log('Setting up testing data');
	await cleanDatabase();
	const { actingClass, course, student1 } = await seedTestData();
	exampleClass = actingClass;
	exampleCourse = course;
	exampleStudent = student1;

	authConfig.verify = () =>
		Promise.resolve({
			userId: student1.clerkId,
			sessionId: 'test-session',
			orgId: undefined,
		});
	assertExists(exampleClass);
	assertExists(exampleCourse);
	assertExists(exampleStudent);
});

Deno.test.afterEach(async () => {
	await db.$disconnect();
	await testDb.$disconnect();
});

Deno.test.afterAll(async () => {
	await db.$disconnect();
	await testDb.$disconnect();
});
const authHeaders = { 'Authorization': 'Bearer test-token' };

Deno.test('Updated attendance by class id', async () => {
	assertExists(exampleStudent);
	assertExists(exampleClass);
	const app = createApp(db);
	const student1Attendance = {
		userId: exampleStudent.id,
		status: 'ATTENDED',
	};

	const request = new Request(
		`http://localhost:8000/api/v1/attendance/${exampleClass?.id}`,
		{
			method: 'PATCH',
			headers: authHeaders,
			body: JSON.stringify([student1Attendance]),
		},
	);
	const response = await app.handle(request);
	// Assertions
	assertExists(response);
	const body = await response.json();
	console.log(body);

	assertEquals(response.status, 200);

	const updatedAttendance = await db.attendance.findUnique({
		where: {
			userId_classId: {
				userId: exampleStudent.id,
				classId: exampleClass.id,
			},
		},
	});
	assertEquals(updatedAttendance?.status, 'ATTENDED');
});
