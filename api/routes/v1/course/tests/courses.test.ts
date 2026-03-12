import { createApp } from '../../../../main.ts';
import { cleanDatabase, seedTestData, testDb } from '@/test-utils';

import type { Course, User } from '@/prisma';
import { assertEquals, assertExists } from '@std/assert';
import { CourseWithStudents } from '../../../../../types/course.ts';
import { db } from '@/db';
import { authConfig } from '../../../../middleware/clerkAuth.ts';

let exampleInstructor: User | undefined;
let exampleCourse: Course | undefined;

Deno.test.beforeEach(async () => {
	console.log('Setting up testing data');
	await cleanDatabase();
	const { instructor, course } = await seedTestData();
	authConfig.verify = () =>
		Promise.resolve({
			userId: 'test-user',
			sessionId: 'test-session',
			orgId: undefined,
		});

	exampleInstructor = instructor;
	exampleCourse = course;
});

Deno.test.afterEach(async () => {
	await db.$disconnect();
	await testDb.$disconnect();
});

Deno.test.afterAll(async () => {
	await db.$disconnect();
	await testDb.$disconnect();
});

const noSanitize = { sanitizeOps: false, sanitizeResources: false };
const authHeaders = { 'Authorization': 'Bearer test-token' };

Deno.test({ name: 'GET courses', ...noSanitize }, async () => {
	const app = createApp(db);
	const request = new Request('http://localhost:8000/api/v1/courses', {
		method: 'GET',
		headers: authHeaders,
	});
	const response = await app.handle(request);
	// Assertions
	assertExists(response);
	assertEquals(response.status, 200);

	const body = await response.json();
	assertEquals(Array.isArray(body), true);
	const course: CourseWithStudents = body[0];
	assertEquals(course.title, 'Test Course');
	assertEquals(course.studentLimit, 10);
	assertEquals(Array.isArray(course.students), true);
	assertEquals(course.students.length, 2);
});

Deno.test({ name: 'GET course by ID', ...noSanitize }, async () => {
	const app = createApp(db);
	assertExists(exampleCourse);
	const request = new Request(
		`http://localhost:8000/api/v1/courses/${exampleCourse.id}`,
		{
			method: 'GET',
			headers: authHeaders,
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
});

Deno.test({ name: 'POST courses', ...noSanitize }, async () => {
	assertExists(exampleInstructor);
	const app = createApp(db);
	const createdCourse = {
		'title': 'March Scene Study',
		'startDate': '2026-03-04',
		'startTime': '19:00',
		'endTime': '22:30',
		'location': 'Zephyr',
		'repeatNum': 4,
		'instructorId': exampleInstructor.id,
	};
	const request = new Request('http://localhost:8000/api/v1/courses', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...authHeaders,
		},
		body: JSON.stringify(createdCourse),
	});

	const response = await app.handle(request);
	// Assertions
	assertExists(response);
	assertEquals(response.status, 200);
	const responseBody = await response.json();
	assertEquals(responseBody.classes.length, 4);
	console.log(responseBody);
});

Deno.test({ name: 'PATCH course by id', ...noSanitize }, async () => {
	const app = createApp(db);
	assertExists(exampleCourse);
	assertExists(exampleInstructor);

	const editData = {
		id: exampleCourse.id,
		title: 'Edited Course',
		studentLimit: 20,
		instructorId: exampleInstructor.id,
	};
	const request = new Request(
		`http://localhost:8000/api/v1/courses/${exampleCourse.id}`,
		{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				...authHeaders,
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
});

Deno.test({ name: 'DELETE course by id', ...noSanitize }, async () => {
	const app = createApp(db);
	assertExists(exampleCourse);

	const request = new Request(
		`http://localhost:8000/api/v1/courses/${exampleCourse.id}`,
		{
			method: 'DELETE',
			headers: authHeaders,
		},
	);
	const response = await app.handle(request);
	// Assertions
	assertExists(response);
	console.log(response);
	assertEquals(response.status, 204);
});
