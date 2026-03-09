import { ScenesColumns } from "./constants.ts";
import classNames from "classnames/index.js";
import { UserContext } from "../../App.tsx";
import { useSelector } from "@xstate/react";
import { BasicGrid } from "../../components/agGrid/Grid.tsx";

export const ScenesGrid = () => {
  const { sceneRef } = useSelector(UserContext.useActorRef(), (state) => {
    return state.context;
  });
  const { data, loading } = useSelector(sceneRef, (state) => {
    return state.context;
  });

  return (
    <div className={classNames("w-full", "border-2")}>
      <div className="p-4 space-y-4 mx-auto ">
        <h1 className="text-2xl font-semibold text-left">Scenes</h1>
        <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
          <BasicGrid
            data={data}
            loading={loading}
            colDefs={ScenesColumns}
            pagination={false}
            cyTag="scenes-grid"
          />
        </div>
      </div>
    </div>
  );
};
