import { CourseColumns } from "./constants.ts";
import classNames from "classnames/index.js";
import { UserContext } from "../../App.tsx";
import { useSelector } from "@xstate/react";
import { BasicGrid } from "../../components/agGrid/Grid.tsx";

export const CoursesGrid = () => {
  const { courseRef } = useSelector(UserContext.useActorRef(), (state) => {
    return state.context;
  });
  const { data, loading } = useSelector(courseRef, (state) => {
    return state.context;
  });

  return (
    <div className={classNames("w-full", "border-2")}>
      <div className="p-4 space-y-4 mx-auto ">
        <h1 className="text-2xl font-semibold text-left">Courses</h1>

        <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
          <BasicGrid
            data={data}
            loading={loading}
            colDefs={CourseColumns}
            pagination
          />
        </div>
      </div>
    </div>
  );
};
