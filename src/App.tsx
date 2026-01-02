import "./App.css";
import { Home } from "./pages/Home.tsx";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <Home />
      </SignedIn>
    </header>
  );
}

export default App;
