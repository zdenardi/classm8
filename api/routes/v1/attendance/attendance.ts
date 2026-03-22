import { Router } from '@oak/oak';
import { clerkAuth } from '../../../middleware/clerkAuth.ts';
import { AttendanceStatus } from '../../../../types/attendance.ts';

const attendanceRouter = new Router();

attendanceRouter.patch('/attendance/:classId', clerkAuth, async (context) => {
	const db = context.app.state.prisma;
	const { classId } = context.params;
	const data: { userId: number; status: AttendanceStatus }[] = await context
		.request.body.json();
	const foundClass = await db.class.findUnique({
		where: {
			id: Number(classId),
		},
	});

	if (!foundClass) {
		context.response.status = 404;
		context.response.body = { error: 'Class not found' };
		return;
	}
	const results = await Promise.all(
		data.map((item) =>
			db.attendance.update({
				where: {
					userId_classId: {
						userId: item.userId,
						classId: Number(classId),
					},
				},
				data: { status: item.status },
			})
		),
	);
	context.response.body = results;
});

export default attendanceRouter;
