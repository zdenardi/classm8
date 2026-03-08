import { useSelector } from "@xstate/react";
import { UserContext } from "../App.tsx";
import { BasicGrid } from "../components/agGrid/Grid.tsx";
import { IClassWithCourseAndScenes } from "../types/class.ts";
import { ColDef } from "ag-grid-community";
import { useClasses } from "../hooks/contextHooks.ts";

export const ClassPage = () => {
  const { loading, classes } = useClasses();

  const ClassesWithScenesColumns: ColDef<IClassWithCourseAndScenes>[] = [
    {
      field: "id",
      hide: true,
    },
    {
      field: "location",
      headerName: "Location",
    },
    {
      field: "startDate",
      headerName: "Date",
    },
  ];

  return (
    <>
      <p>Classes</p>
      <BasicGrid
        data={classes}
        loading={loading}
        colDefs={ClassesWithScenesColumns}
        pagination
      />
    </>
  );
};
