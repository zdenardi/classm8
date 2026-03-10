import { createApp } from '../../../../main.ts';
import { cleanDatabase, seedTestData } from '@/test-utils';
import { authConfig } from '../../../../middleware/clerkAuth.ts';

import type { Scene, User } from '@/prisma';
import { assertEquals, assertExists } from '@std/assert';
import { db } from '@/db';

let exampleScene: Scene | undefined;
let student1: User | undefined;
let student2: User | undefined;
let originalVerify: typeof authConfig.verify;

const mockVerify = () =>
	Promise.resolve({
		userId: 'student1',
		sessionId: 'test-session',
		orgId: undefined,
	});

Deno.test.beforeEach(async () => {
	console.log('Setting up testing data');
	originalVerify = authConfig.verify;

	// Make the property configurable
	Object.defineProperty(authConfig, 'verify', {
		value: mockVerify,
		writable: true,
		configurable: true,
	});

	await cleanDatabase();
	const seedData = await seedTestData();
	exampleScene = seedData.scene;
	student1 = seedData.student1;
	student2 = seedData.student2;
	assertExists(exampleScene);
	assertExists(student1);
	assertExists(student2);
});

Deno.test.afterEach(async () => {
	Object.defineProperty(authConfig, 'verify', {
		value: originalVerify,
		writable: true,
		configurable: true,
	});
	await db.$disconnect();
});

Deno.test('GET /scenes - should return all scenes', async () => {
	const app = createApp(db);
	const request = new Request('http://localhost:8000/api/v1/scenes', {
		method: 'GET',
		headers: { Authorization: 'Bearer fake-token' },
	});
	const response = await app.handle(request);

	// Assertions
	assertExists(response);
	assertExists(exampleScene);
	assertEquals(response.status, 200);

	const body = await response.json();
	assertEquals(Array.isArray(body), true);

	const scene = body[0];
	assertEquals(scene.id, exampleScene.id);
	assertEquals(scene.title, exampleScene.title);
	assertEquals(scene.duration, exampleScene.duration);
	assertEquals(scene.type, exampleScene.type);

	// Check that performers are included
	assertExists(scene.performers);
	assertEquals(Array.isArray(scene.performers), true);
	assertEquals(scene.performers.length, 2);

	// Check that classes are included
	assertExists(scene.classes);
	assertEquals(Array.isArray(scene.classes), true);
});

Deno.test('GET /scenes/:id - should return a specific scene by id', async () => {
	const app = createApp(db);
	assertExists(exampleScene);

	const request = new Request(
		`http://localhost:8000/api/v1/scenes/${exampleScene.id}`,
		{
			method: 'GET',
		},
	);
	const response = await app.handle(request);

	// Assertions
	assertExists(response);
	assertEquals(response.status, 200);

	const scene = await response.json();
	assertEquals(scene.id, exampleScene.id);
	assertEquals(scene.title, exampleScene.title);
	assertEquals(scene.duration, exampleScene.duration);
	assertEquals(scene.type, exampleScene.type);
	assertEquals(scene.notes, exampleScene.notes);

	// Check that performers are included with user data
	assertExists(scene.performers);
	assertEquals(Array.isArray(scene.performers), true);
	assertEquals(scene.performers.length, 2);
	assertExists(scene.performers[0].user);

	// Check that classes are included with class data
	assertExists(scene.classes);
	assertEquals(Array.isArray(scene.classes), true);
});

Deno.test('POST /scenes - should create a new scene', async () => {
	assertExists(student1);
	assertExists(student2);

	const app = createApp(db);
	const newScene = {
		duration: 15,
		title: 'New Test Scene',
		type: 'FILM',
		notes: 'A new scene for testing',
	};

	const request = new Request('http://localhost:8000/api/v1/scenes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer fake-token',
		},
		body: JSON.stringify(newScene),
	});

	const response = await app.handle(request);
	console.log(response);

	// Assertions
	assertExists(response);

	assertEquals(response.status, 200);

	const createdScene = await response.json();
	assertExists(createdScene.id);
	assertEquals(createdScene.title, newScene.title);
	assertEquals(createdScene.duration, newScene.duration);
	assertEquals(createdScene.type, newScene.type);
	assertEquals(createdScene.notes, newScene.notes);
});

Deno.test('PATCH /scenes/:id - should update a scene', async () => {
	assertExists(exampleScene);

	const app = createApp(db);
	const updateData = {
		title: 'Updated Scene Title',
		duration: 20,
		notes: 'Updated notes for the scene',
	};

	const request = new Request(
		`http://localhost:8000/api/v1/scenes/${exampleScene.id}`,
		{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData),
		},
	);

	const response = await app.handle(request);

	// Assertions
	assertExists(response);
	assertEquals(response.status, 200);

	const updatedScene = await response.json();
	assertEquals(updatedScene.id, exampleScene.id);
	assertEquals(updatedScene.title, updateData.title);
	assertEquals(updatedScene.duration, updateData.duration);
	assertEquals(updatedScene.notes, updateData.notes);
	assertEquals(updatedScene.type, exampleScene.type); // Should remain unchanged

	// Check that performers are still included
	assertExists(updatedScene.performers);
	assertEquals(Array.isArray(updatedScene.performers), true);
});

Deno.test('DELETE /scenes/:id - should delete a scene', async () => {
	assertExists(exampleScene);

	const app = createApp(db);

	const request = new Request(
		`http://localhost:8000/api/v1/scenes/${exampleScene.id}`,
		{
			method: 'DELETE',
		},
	);

	const response = await app.handle(request);

	// Assertions
	assertExists(response);
	assertEquals(response.status, 204);

	// Verify the scene was actually deleted
	const deletedScene = await db.scene.findUnique({
		where: { id: exampleScene.id },
	});
	assertEquals(deletedScene, null);
});
