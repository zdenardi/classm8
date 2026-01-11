import { useEffect } from "react";
import { UserContext } from "../App.tsx";
import { useSelector } from "@xstate/react";
export const SignedInWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userRef = UserContext.useActorRef();
  const { loading } = useSelector(userRef, (state) => {
    return state.context;
  });

  useEffect(() => {
    userRef.send({ type: "ON_CHECK_REGISTRATION" });
  }, [loading]);
  return children;
};
