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
import { AddScene } from "./pages/AddScene.tsx";
import { AddCourse } from "./pages/AddCourse.tsx";
import { ClassPage } from "./pages/Class.tsx";
import { USER_STATE } from "./constants/xstateSystem.ts";
import { AuthStateMachine } from "./stateMachines/AuthStateMachine.tsx";
import { Layout } from "./components/Layout.tsx";

const TokenGetter = () => {
  const { getToken } = useAuth();
  useEffect(() => {
    tokenGetter.setTokenFunction(() => getToken());
  }, [getToken]);
  return null;
};

export const UserContext = createActorContext(userState, {
  id: USER_STATE,
  systemId: USER_STATE,
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
          <AuthStateMachine />
          <UserButton />
          <SignedInWrapper>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/classes" element={<ClassPage />} />
                <Route path="/addScene" element={<AddScene />} />
                <Route path="/addCourse" element={<AddCourse />} />
              </Routes>
            </Layout>
          </SignedInWrapper>
        </SignedIn>
      </UserContext.Provider>
    </header>
  );
}

export default App;
