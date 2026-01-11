import { Router } from '@oak/oak';
import { verifyClerkSession } from '../../../util/auth.ts';

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
		console.log({ session });

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

export default authRouter;
