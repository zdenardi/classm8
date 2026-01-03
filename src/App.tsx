import { useEffect } from "react";
import "./App.css";
import { Home } from "./pages/Home.tsx";
import classNames from "classnames";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import tokenGetter from "./utils/auth.ts";
import { GRID_CONTAINER } from "./constants/grid.ts";

const TokenGetter = () => {
  const { getToken } = useAuth();
  useEffect(() => {
    tokenGetter.setTokenFunction(async () => getToken());
  }, [getToken]);
  return null;
};

function App() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <TokenGetter />
        <UserButton />

        <Home />
      </SignedIn>
    </header>
  );
}

export default App;
