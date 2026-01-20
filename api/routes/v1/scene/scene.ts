import { Router } from '@oak/oak';
import { PrismaClient, Scene } from '@/prisma';
import { clerkAuth } from '../../../middleware/clerkAuth.ts';

const sceneRouter = new Router();

sceneRouter.get('/scenes', clerkAuth, async (context) => {
	const db = context.app.state.prisma;
	const scenes = await db.scene.findMany({
		include: {
			performers: {
				include: {
					firstName: true,
					lastName: true,
					email: true,
				},
			},
			classes: {
				include: {
					startDate: true,
					endDate: true,
					location: true,
				},
			},
		},
	});
	context.response.body = scenes;
});

sceneRouter.get('/scenes/:id', async (context) => {
	const db = context.app.state.prisma;
	const { id } = context.params;
	const foundScene = await db.scene.findUnique({
		where: {
			id: Number(id),
		},
		include: {
			performers: {
				include: {
					firstName: true,
					lastName: true,
					email: true,
				},
			},
			classes: {
				include: {
					startDate: true,
					endDate: true,
					location: true,
				},
			},
		},
	});
	context.response.body = foundScene;
});

sceneRouter.post('/scenes', async (context) => {
	const db = context.app.state.prisma;
	const data: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'> = await context
		.request.body.json();
	const createdScene = await db.class.create({ data });
	context.response.body = createdScene;
});

sceneRouter.patch('/scenes/:id', async (context) => {
	const db: PrismaClient = context.app.state.prisma;
	const data: Partial<Scene> = await context.request.body.json();
	const { id } = context.params;
	const updatedScene = await db.scene.update({
		where: {
			id: Number(id),
		},
		data,
		include: {
			performers: {
				include: {
					user: true,
				},
			},
			classes: {
				include: {
					class: true,
				},
			},
		},
	});
	context.response.body = updatedScene;
});

sceneRouter.delete('/scenes/:id', async (context) => {
	const db: PrismaClient = context.app.state.prisma;
	const { id } = context.params;
	await db.scene.delete({
		where: {
			id: Number(id),
		},
	});
	context.response.status = 204;
});

export default sceneRouter;
