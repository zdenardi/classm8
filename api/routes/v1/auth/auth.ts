import { Router } from '@oak/oak';
import { verifyClerkSession } from '../../../util/auth.ts';
import { User } from '@/prisma';

const authRouter = new Router();

authRouter.get('/auth', async (context) => {
	const auth = context.request.headers.get('Authorization');

	const session = await verifyClerkSession(auth as string);
	if (session == null) {
		context.response.body = {
			redirect: '/register',
			message: 'User not logged in, please login',
		};
		context.response.status = 300;
	} else {
		const { userId } = session;
		const db = context.app.state.prisma;

		const user = await db.user.findUnique({
			where: { clerkId: userId },
		});
		if (!user) {
			context.response.body = {
				redirect: '/register',
				message: 'User not found, please complete registration',
			};
			context.response.status = 300;
			return;
		} else {
			context.response.body = {
				user,
			};
			context.response.status = 200;
		}
	}
});

//Registers new user

authRouter.post('/auth', async (context) => {
	const auth = context.request.headers.get('Authorization');
	const session = await verifyClerkSession(auth as string);
	if (session == null) {
		context.response.body = {
			message: 'User not logged in, please login',
		};
		context.response.status = 401;
	} else {
		const db = context.app.state.prisma;
		const data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = await context
			.request
			.body.json();
		console.log(data);

		const newUser = await db.user.create({
			data: {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				role: data.role,
				clerkId: session.userId,
			},
		});
		context.response.body = newUser;
		context.response.status = 201;
	}
});

export default authRouter;
