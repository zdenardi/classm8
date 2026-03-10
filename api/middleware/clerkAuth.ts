import { Context } from '@oak/oak';
import { verifyClerkSession } from '../util/auth.ts';

export const authConfig = {
	verify: verifyClerkSession,
};

export async function clerkAuth(ctx: Context, next: () => Promise<unknown>) {
	const auth = ctx.request.headers.get('Authorization');
	if (!auth) {
		ctx.response.status = 401;
		ctx.response.body = { error: 'Unauthorized' };
		return;
	}

	const session = await authConfig.verify(auth as string);

	if (!session) {
		ctx.response.status = 401;
		ctx.response.body = { error: 'Unauthorized' };
		return;
	}
	ctx.state.auth = session;
	await next();
}
