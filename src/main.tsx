import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Import AG Grid setup to register modules
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}
const clerkConfig = {
  publishableKey: PUBLISHABLE_KEY || "__CLERK_KEY_PLACEHOLDER__",
  standardBrowser: import.meta.env.NODE_ENV !== "test",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider {...clerkConfig}>
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
);
