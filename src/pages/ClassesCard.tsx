import { useMachine } from "@xstate/react";
import { Card } from "../components/Card.tsx";
import { Badge } from "../components/catalyst/badge.tsx";
import {
  useClasses,
  useCourses,
  useRoster,
  useScenes,
} from "../hooks/contextHooks.ts";
import { dialogMachine } from "../stateMachines/dialog.machine.ts";
import { IClassWithCourseAndScenes } from "../types/class.ts";
import { Button } from "../components/catalyst/button.tsx";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
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
import { useState } from "react";

const sceneColDefs: ColDef[] = [
  { field: "title", headerName: "Title", pinned: "left" },
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

const ClassDetailItem = ({
  classObj,
}: {
  classObj: IClassWithCourseAndScenes;
}) => {
  const [state, send] = useMachine(dialogMachine, {
    id: `classDetailDialog-${classObj.id}`,
    input: { isOpen: false },
  });
  const { isOpen } = state.context;
  const { scenesProvider, loading } = useScenes();
  const { classesProvider } = useClasses();

  const handleOpenDialog = () => {
    send({ type: "ON_OPEN" });
  };

  const handleCloseDialog = () => {
    send({ type: "ON_CLOSE" });
  };

  const handleApproveScene = (sceneId: number) => {
    scenesProvider.send({
      type: "ON_APPROVE_SCENE",
      classId: classObj.id,
      sceneId,
    });
  };

  const handleDeleteScene = (sceneId: number) => {
    scenesProvider.send({
      type: "ON_DELETE_SCENE",
      classId: classObj.id,
      sceneId,
    });
  };

  const unconfirmedSceneColDefs: ColDef[] = [
    ...sceneColDefs,
    { field: "order", headerName: "Order", flex: 0, width: 120 },
    {
      headerName: "Actions",
      pinned: "right",
      cellRenderer: (p) => {
        return (
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => {
                handleApproveScene(p.data.id);
              }}
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                handleDeleteScene(p.data.id);
              }}
            >
              <XCircleIcon className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center m-2">
      <Button plain type="button" onClick={handleOpenDialog} className="w-full">
        <div className="flex gap-2 ">
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
            <div>
              <p>Scenes Confirmed</p>
              <BasicGrid
                data={classObj.scenes
                  .filter((s) => s.approved)
                  .map((s) => s.scene)}
                loading={loading}
                colDefs={sceneColDefs}
                pagination={false}
              />
            </div>
            <div>
              <p>Scenes Unconfirmed</p>
              <BasicGrid
                data={classObj.scenes
                  .filter((s) => !s.approved)
                  .map((s) => s.scene)}
                loading={loading}
                colDefs={unconfirmedSceneColDefs}
                pagination={false}
              />
            </div>
          </DialogBody>
        </div>
      </Dialog>
    </div>
  );
};

export const ClassesDetails = ({
  classes,
}: {
  classes: IClassWithCourseAndScenes[];
}) => {
  return (
    <div>
      {classes.map((classObj) => (
        <ClassDetailItem key={classObj.id} classObj={classObj} />
      ))}
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
  const { courseProvider, loading } = useCourses();

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

  if (loading) {
    return null;
  }

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
