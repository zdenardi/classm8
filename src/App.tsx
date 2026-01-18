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
import { Route, Routes } from "react-router";
import { RegistrationForm } from "./features/registration/RegistrationForm.tsx";
import { XStateRedirectListener } from "./components/XStateRedirectListener.tsx";

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
        <XStateRedirectListener />
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <TokenGetter />
          <UserButton />
          <SignedInWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegistrationForm />} />
            </Routes>
          </SignedInWrapper>
        </SignedIn>
      </UserContext.Provider>
    </header>
  );
}

export default App;
