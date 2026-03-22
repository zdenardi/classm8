import { createApp } from '../../../../main.ts';
import { cleanDatabase, seedTestData, testDb } from '@/test-utils';
import type { Class, Course } from '@/prisma';
import { assertEquals, assertExists } from '@std/assert';
import {
	ClassWithCourseAndScenesAndAttendance,
} from '../../../../../types/class.ts';
import { db } from '@/db';
import { authConfig } from '../../../../middleware/clerkAuth.ts';

let exampleClass: Class | undefined;
let exampleCourse: Course | undefined;

Deno.test.beforeEach(async () => {
	console.log('Setting up testing data');
	await cleanDatabase();
	const { actingClass, course, student1 } = await seedTestData();
	exampleClass = actingClass;
	exampleCourse = course;

	authConfig.verify = () =>
		Promise.resolve({
			userId: student1.clerkId,
			sessionId: 'test-session',
			orgId: undefined,
		});
	assertExists(exampleClass);
	assertExists(exampleCourse);
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

Deno.test('GET classes', async () => {
	const app = createApp(db);
	const request = new Request('http://localhost:8000/api/v1/classes', {
		method: 'GET',
		headers: authHeaders,
	});
	const response = await app.handle(request);
	// Assertions
	assertExists(response);
	assertExists(exampleClass);
	assertEquals(response.status, 200);

	const body = await response.json();
	assertEquals(Array.isArray(body), true);
	const actingClass: ClassWithCourseAndScenesAndAttendance = body[0];

	assertEquals(actingClass.id, exampleClass.id);
});

Deno.test('GET class by id', async () => {
	const app = createApp(db);
	const request = new Request(
		`http://localhost:8000/api/v1/classes/${exampleClass?.id}`,
		{
			method: 'GET',
			headers: authHeaders,
		},
	);
	const response = await app.handle(request);
	// Assertions
	assertExists(response);
	assertExists(exampleClass);
	assertEquals(response.status, 200);

	const actingClass: ClassWithCourseAndScenesAndAttendance = await response
		.json();
	assertEquals(actingClass.id, exampleClass.id);
	console.log(actingClass);

	db.$disconnect();
});

Deno.test('POST classes', async () => {
	assertExists(exampleCourse);
	const app = createApp(db);
	const createdClass = {
		courseId: exampleCourse.id,
		location: 'Some place',
		notes: 'Here are some notes',
		startDate: new Date('2025-01-01T18:00:00'),
		endDate: new Date('2025-01-01T21:00:00'),
		streamingLink: '',
	};
	const request = new Request('http://localhost:8000/api/v1/classes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...authHeaders,
		},
		body: JSON.stringify(createdClass),
	});

	const response = await app.handle(request);
	// Assertions
	assertExists(response);
	assertEquals(response.status, 200);

	db.$disconnect();
});

Deno.test('PATCH class by id', async () => {
	assertExists(exampleClass);
	assertExists(exampleCourse);
	const app = createApp(db);
	const data = {
		id: exampleClass.id,
		courseId: exampleCourse.id,
		location: 'Some place',
		notes: 'Here are some notes',
		startDate: new Date('2025-01-02T18:00:00').toISOString(),
		endDate: new Date('2025-01-02T21:00:00').toISOString(),
		streamingLink: 'zoomLink',
	};
	const request = new Request(
		`http://localhost:8000/api/v1/classes/${exampleClass?.id}`,
		{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				...authHeaders,
			},
			body: JSON.stringify(data),
		},
	);
	const response = await app.handle(request);
	// Assertions
	assertExists(response);
	assertEquals(response.status, 200);

	const actingClass: ClassWithCourseAndScenes = await response.json();
	assertEquals(actingClass.id, exampleClass.id);
	assertEquals(actingClass.streamingLink, data.streamingLink);

	db.$disconnect();
});

Deno.test('DELETE class by id', async () => {
	assertExists(exampleClass);
	const app = createApp(db);

	const request = new Request(
		`http://localhost:8000/api/v1/classes/${exampleClass?.id}`,
		{
			method: 'DELETE',
			headers: authHeaders,
		},
	);
	const response = await app.handle(request);
	// Assertions
	assertExists(response);
	assertEquals(response.status, 204);

	db.$disconnect();
});
