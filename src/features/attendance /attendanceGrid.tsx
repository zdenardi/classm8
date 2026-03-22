import classNames from "classnames/index.js";
import { BasicGrid } from "../../components/agGrid/Grid.tsx";
import { useModeratorView } from "../../hooks/contextHooks.ts";
import { AttendanceColumns } from "./constants.tsx";
import { RefObject } from "react";
import { AgGridReact } from "ag-grid-react";

interface Props {
  gridRef: RefObject<AgGridReact | null>;
}

export const AttendanceGrid = (props: Props) => {
  const { _class } = useModeratorView();
  if (!_class) {
    return null;
  }
  const attendance = _class.attendances;

  return (
    <div className={classNames("w-full", "border-2")}>
      <div className="p-4 space-y-4 mx-auto ">
        <h1 className="text-2xl font-semibold text-left">Attendance</h1>
        <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
          {!attendance && <p>No Attendance Found</p>}
          <BasicGrid
            gridRef={props.gridRef}
            data={attendance || []}
            loading={false}
            colDefs={AttendanceColumns}
            pagination
          />
        </div>
      </div>
    </div>
  );
};
