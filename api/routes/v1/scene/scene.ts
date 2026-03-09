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
	context.response.body = foundScene;
});

sceneRouter.post('/scenes', clerkAuth, async (context) => {
	const db = context.app.state.prisma;
	const { userId } = context.state.auth;
	const data: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'> & {
		performerIds?: number[];
		classId?: number;
	} = await context.request.body.json();

	const { performerIds, classId, ...sceneData } = data;

	const user = await db.user.findUnique({
		where: {
			clerkId: userId,
		},
	});

	const allPerformerIds = user?.id
		? [...(performerIds || []), user.id]
		: performerIds || [];

	const createdScene = await db.scene.create({
		data: {
			...sceneData,
			performers: {
				create: allPerformerIds.map((performerId: number) => ({
					user: {
						connect: { id: performerId },
					},
				})),
			},
			...(classId && {
				classes: {
					create: {
						classId: classId,
						approved: false,
						order: 0,
					},
				},
			}),
		},
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
