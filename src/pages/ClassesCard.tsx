import { useMachine } from "@xstate/react";
import { Card } from "../components/Card.tsx";
import { Badge } from "../components/catalyst/badge.tsx";
import { useClasses, useCourses, useRoster } from "../hooks/contextHooks.ts";
import { dialogMachine } from "../stateMachines/dialog.machine.ts";
import { IClassWithCourseAndScenes } from "../types/class.ts";
import { Button } from "../components/catalyst/button.tsx";
import {
  Dialog,
  DialogTitle,
  DialogBody,
} from "../components/catalyst/dialog.tsx";
import { BasicGrid } from "../components/agGrid/Grid.tsx";
import type { ColDef } from "ag-grid-community";
import { CourseForm } from "../features/course/CourseForm.tsx";
import { transformUsersToOptions } from "../utils/helperfunctions/users.ts";
import { CourseFormValues } from "../features/course/schema.ts";

const sceneColDefs: ColDef[] = [
  { field: "title", headerName: "Title" },
  {
    headerName: "Performers",
    valueGetter: (p) =>
      p.data.performers
        .map((perf: { user: { firstName: string } }) => perf.user.firstName)
        .join(", "),
  },
  { field: "duration", headerName: "Duration (min)", flex: 0, width: 140 },
  { field: "type", headerName: "Type", flex: 0, width: 120 },
];

export const ClassesDetails = ({
  classes,
}: {
  classes: IClassWithCourseAndScenes[];
}) => {
  const [state, send] = useMachine(dialogMachine, {
    id: "classesDetailsDialog",
    input: { isOpen: false },
  });
  const { isOpen } = state.context;

  const handleOpenDialog = () => {
    send({ type: "ON_OPEN" });
  };

  const handleCloseDialog = () => {
    send({ type: "ON_CLOSE" });
  };

  return (
    <div>
      {classes.map((classObj) => {
        return (
          <div
            key={classObj.id}
            className="flex flex-col justify-center items-center"
          >
            <Button
              plain
              type="button"
              onClick={handleOpenDialog}
              className="w-full"
            >
              <div className="flex gap-2">
                <Badge>
                  {" "}
                  {new Date(classObj.startDate).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Badge>
                <p>
                  {classObj.location} - {classObj.course.title}
                </p>
              </div>
            </Button>
            <Dialog open={isOpen} onClose={handleCloseDialog} size="4xl">
              <div className="p-4">
                <DialogTitle>Class Itinerary</DialogTitle>
                <DialogBody>
                  <BasicGrid
                    data={classObj.scenes.map((s) => s.scene)}
                    loading={false}
                    colDefs={sceneColDefs}
                    pagination={false}
                  />
                </DialogBody>
              </div>
            </Dialog>
          </div>
        );
      })}
    </div>
  );
};

export const ClassesCard = () => {
  const [state, send] = useMachine(dialogMachine, {
    id: "addClassDialog",
    input: { isOpen: false },
  });
  const { roster } = useRoster();
  const { classes } = useClasses();
  const { isOpen } = state.context;
  const { courseProvider } = useCourses();

  const handleCloseDialog = () => {
    send({ type: "ON_CLOSE" });
  };
  const handleOpenDialog = () => {
    send({ type: "ON_OPEN" });
  };
  const handleSubmit = (values: CourseFormValues) => {
    courseProvider.send({
      type: "ON_CREATE_COURSE",
      values,
    });
    handleCloseDialog();
  };

  return (
    <Card className="col-span-4">
      <div className="flex justify-end">
        <Button primary size="small" onClick={handleOpenDialog}>
          Add Course and Classes
        </Button>
      </div>
      <div className="border-l-4 border-blue-500 pl-4 mb-4">
        <h3 className="text-xl text-start font-bold text-gray-900 dark:text-white">
          Classes
        </h3>
      </div>
      <div>
        <ClassesDetails classes={classes} />
        <Dialog open={isOpen} onClose={handleCloseDialog} size="4xl">
          <div className="p-4">
            <DialogTitle>Class Itinerary</DialogTitle>
            <DialogBody>
              <CourseForm
                sendValues={handleSubmit}
                handleError={handleCloseDialog}
                instructors={transformUsersToOptions(
                  roster.filter((user) => user.role === "INSTRUCTOR"),
                )}
              />
            </DialogBody>
          </div>
        </Dialog>
      </div>
    </Card>
  );
};
