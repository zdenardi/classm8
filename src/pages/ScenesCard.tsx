import { useMachine } from "@xstate/react";
import { Card } from "../components/Card.tsx";
import { Badge } from "../components/catalyst/badge.tsx";
import { dialogMachine } from "../stateMachines/dialog.machine.ts";
import {
  Dialog,
  DialogTitle,
  DialogBody,
} from "../components/catalyst/dialog.tsx";
import { SceneForm } from "../features/scene/SceneForm.tsx";
import { useClasses, useRoster, useScenes } from "../hooks/contextHooks.ts";
import { transformUsersToOptions } from "../utils/helperfunctions/users.ts";
import { transformClassesToOptions } from "../utils/helperfunctions/classes.ts";
import { SceneFormValues } from "../features/scene/schema.ts";
import { transformSceneFormValuesToScene } from "../utils/helperfunctions/scenes.ts";

export const ScenesCard = () => {
  const [state, send] = useMachine(dialogMachine, {
    id: "scenesCardDialog",
    input: { isOpen: false },
  });
  const { roster } = useRoster();
  const { classes } = useClasses();
  const { scenesProvider, scenes, loading } = useScenes();
  const { isOpen } = state.context;

  const handleOpenDialog = () => {
    send({ type: "ON_OPEN" });
  };

  const handleCloseDialog = () => {
    send({ type: "ON_CLOSE" });
  };

  const handleSubmit = (values: SceneFormValues) => {
    scenesProvider.send({
      type: "ON_CREATE_SCENE",
      values: transformSceneFormValuesToScene(values),
    });
    handleCloseDialog();
  };

  if (loading) {
    console.log("Loading scenes show nothin!");
    return null;
  }

  return (
    <>
      <Card className="col-span-2">
        <div className="flex justify-end">
          <button type="button" onClick={handleOpenDialog}>
            Add A Scene
          </button>
        </div>
        <div className="border-l-4 border-blue-500 pl-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white ">
            All Your Scenes
          </h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {scenes.length === 0 && (
            <p className="text-gray-500">No Scenes Found</p>
          )}
          {scenes.map((scene) => {
            return (
              <div key={scene.id} className="flex gap-2">
                <Badge color="blue">1/1</Badge>
                <p>
                  {scene.title} - {scene.type}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <Dialog open={isOpen} onClose={handleCloseDialog} size="4xl">
        <DialogTitle>Add A Scene</DialogTitle>
        <DialogBody>
          <SceneForm
            rosterOptions={transformUsersToOptions(roster)}
            sendValues={(values) => handleSubmit(values)}
            handleError={() => console.log("")}
            classOptions={transformClassesToOptions(classes)}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};
