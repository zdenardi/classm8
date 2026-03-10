import { Router } from '@oak/oak';
import { Prisma } from '@/prisma';
import { clerkAuth } from '../../../middleware/clerkAuth.ts';

const profileRouter = new Router();

profileRouter.get('/profile', clerkAuth, async (context) => {
	const db = context.app.state.prisma;
	const clerkId = context.state.auth.userId;

	const user = await db.user.findUnique({
		where: { clerkId },
	});

	if (!user) {
		context.response.status = 404;
		console.log(context.state);
		context.response.body = { error: 'User not found' };
		return;
	}

	const userId = user.id;

	const [scenes, classes, courses] = await db.$transaction(
		async (tx: Prisma.TransactionClient) => {
			const scenes = await tx.scene.findMany({
				where: {
					performers: {
						some: { userId },
					},
				},
				include: {
					performers: {
						include: { user: true },
					},
					classes: {
						include: { class: true },
					},
				},
			});
			console.log('scenes:', scenes);

			const classes = await tx.class.findMany({
				where: {
					scenes: {
						some: {
							scene: {
								performers: {
									some: { userId },
								},
							},
						},
					},
				},
			});
			console.log('classes:', classes);

			const courses = await tx.course.findMany({
				where: {
					classes: {
						some: {
							scenes: {
								some: {
									scene: {
										performers: {
											some: { userId },
										},
									},
								},
							},
						},
					},
				},
			});
			console.log('courses:', courses);

			return [scenes, classes, courses] as const;
		},
	);

	context.response.body = { scenes, classes, courses };
});

export default profileRouter;
