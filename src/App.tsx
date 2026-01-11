import { useEffect } from "react";
import "./App.css";
import { Home } from "./pages/Home.tsx";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import tokenGetter from "./utils/auth.ts";
import { userState } from "./stateMachines/userState.machine.ts";
import { createActorContext } from "@xstate/react";
import { SignedInWrapper } from "./features/SignedInWrapper.tsx";

const TokenGetter = () => {
  const { getToken } = useAuth();
  useEffect(() => {
    tokenGetter.setTokenFunction(async () => getToken());
  }, [getToken]);
  return null;
};
export const UserContext = createActorContext(userState, {
  id: "userState",
  systemId: "userState",
});

function App() {
  return (
    <header>
      <UserContext.Provider>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <TokenGetter />
          <UserButton />
          <SignedInWrapper>
            <Home />
          </SignedInWrapper>
        </SignedIn>
      </UserContext.Provider>
    </header>
  );
}

export default App;
