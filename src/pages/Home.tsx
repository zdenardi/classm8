import { ScenesCard } from "./ScenesCard.tsx";
import { ClassesCard } from "./ClassesCard.tsx";
import { UpcomingScenes } from "./UpcomingScenes.tsx";
export const Home = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <UpcomingScenes />
      <ScenesCard />
      <ClassesCard />
    </div>
  );
};
