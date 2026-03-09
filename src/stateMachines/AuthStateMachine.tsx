/**
 * Auth state machine connector
 *
 * Connects Clerk Auth state to Xstate
 * Also sets up the token getter so auth is ready before state transitions
 */

import { useAuth } from "@clerk/clerk-react";
import { UserContext } from "../App.tsx";
import { useEffect } from "react";
import tokenGetter from "../utils/auth.ts";

export const AuthStateMachine = () => {
  const { userId, isSignedIn, getToken } = useAuth();
  const userRef = UserContext.useActorRef();

  // Set token function first, then trigger state transitions
  useEffect(() => {
    tokenGetter.setTokenFunction(() => getToken());
  }, [getToken]);

  useEffect(() => {
    if (!isSignedIn) {
      userRef.send({ type: "ON_USER_SIGNED_OUT" });
    } else {
      userRef.send({ type: "ON_USER_SIGNED_IN" });
    }
  }, [isSignedIn, userId, userRef]);

  return null;
};
