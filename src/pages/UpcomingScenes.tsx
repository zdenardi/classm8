import { Card } from "../components/Card.tsx";
import { Badge } from "../components/catalyst/badge.tsx";
import { useProfile } from "../hooks/contextHooks.ts";

export const UpcomingScenes = () => {
  const { profile } = useProfile();
  const scenes = profile?.scenes || [];

  const filteredScenes = scenes.filter((scene) => {
    return scene.classes.some((classObj) => {
      return classObj.class.startDate > new Date();
    });
  });
  return (
    <Card className="sm:col-span-4 md:col-span-2">
      <div className="border-l-4 border-blue-500 pl-4 mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Your Upcoming Scenes
        </h3>
      </div>
      <div className="flex gap-2">
        {filteredScenes.map((scene) => {
          return (
            <div key={scene.id} className="flex gap-2">
              {}
              <Badge color="blue">
                {new Date(scene.classes[0].startDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "2-digit",
                    day: "2-digit",
                  },
                )}
              </Badge>
              <p>
                {scene.title} - {scene.type}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
