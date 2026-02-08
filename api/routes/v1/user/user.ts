import { Router } from '@oak/oak';
import { PrismaClient, Role, Scene } from '@/prisma';
import { clerkAuth } from '../../../middleware/clerkAuth.ts';

const userRouter = new Router();

userRouter.get('/users', clerkAuth, async (context) => {
	const db = context.app.state.prisma;
	const role = context.request.url.searchParams.get('role');

	const users = await db.user.findMany({
		where: role ? { role: role as Role } : {},
	});
	context.response.body = users;
});

userRouter.get('/users/:id', async (context) => {
	const db = context.app.state.prisma;
	const { id } = context.params;
	const user = await db.user.findUnique({
		where: {
			id: Number(id),
		},
	});
	context.response.body = user;
});

userRouter.post('/users', async (context) => {
	const db = context.app.state.prisma;
	const data: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'> = await context
		.request.body.json();
	const createdUser = await db.class.create({ data });
	context.response.body = createdUser;
});

userRouter.patch('/users/:id', async (context) => {
	const db: PrismaClient = context.app.state.prisma;
	const data: Partial<Scene> = await context.request.body.json();
	const { id } = context.params;
	const updatedUser = await db.scene.update({
		where: {
			id: Number(id),
		},
		data,
	});
	context.response.body = updatedUser;
});

userRouter.delete('/users/:id', async (context) => {
	const db: PrismaClient = context.app.state.prisma;
	const { id } = context.params;
	await db.user.delete({
		where: {
			id: Number(id),
		},
	});
	context.response.status = 204;
});

export default userRouter;
