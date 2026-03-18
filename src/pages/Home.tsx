import { useEffect } from "react";
import { ScenesCard } from "./ScenesCard.tsx";
import { ClassesCard } from "./ClassesCard.tsx";
import { UpcomingScenes } from "./UpcomingScenes.tsx";
import { useAuthState } from "../hooks/contextHooks.ts";
import { useNavigate } from "react-router";

export const Home = () => {
  const { isUnauthenticated } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUnauthenticated) {
      navigate("/register");
    }
  }, [isUnauthenticated, navigate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UpcomingScenes />
      <ScenesCard />
      <ClassesCard />
    </div>
  );
};
