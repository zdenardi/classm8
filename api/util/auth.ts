import { verifyToken } from "@clerk/backend";

export async function verifyClerkSession(authHeader?: string) {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = await verifyToken(token, {
      secretKey: Deno.env.get("CLERK_SECRET_KEY")!,
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
