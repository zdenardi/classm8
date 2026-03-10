import { verifyToken } from '@clerk/backend';
export interface Session {
	userId: string;
	sessionId: string;
	orgId: string | undefined;
}
export async function verifyClerkSession(
	authHeader?: string,
): Promise<Session | null> {
	if (!authHeader?.startsWith('Bearer ')) {
		console.warn('No token!');
		return null;
	}

	const token = authHeader.replace('Bearer ', '');

	try {
		const payload = await verifyToken(token, {
			secretKey: Deno.env.get('CLERK_SECRET_KEY')!,
		});

		return {
			userId: payload.sub,
			sessionId: payload.sid,
			orgId: payload.org_id,
		};
	} catch {
		return null;
	}
}
