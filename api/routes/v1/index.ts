import { Router } from '@oak/oak';
import courseRouter from './course/course.ts';
import classRouter from './class/class.ts';
import authRouter from './auth/auth.ts';
import userRouter from './user/user.ts';
import sceneRouter from './scene/scene.ts';
import profileRouter from './profile/profile.ts';
import attendanceRouter from './attendance/attendance.ts';

const router = new Router({ prefix: '/api/v1' });
const ROUTERS = [
	courseRouter,
	classRouter,
	authRouter,
	userRouter,
	sceneRouter,
	profileRouter,
	attendanceRouter,
];

ROUTERS.forEach((r) => {
	router.use(r.routes());
	router.use(r.allowedMethods());
});

export default router;
