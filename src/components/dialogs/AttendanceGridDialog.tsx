import { RefObject, useRef } from "react";
import { AgGridReact } from "../../../$node_modules/.deno/ag-grid-react@35.1.0/$node_modules/ag-grid-react/dist/types/src/agGridReact.js";
import { Button } from "../catalyst/button.tsx";
import { Dialog, DialogBody } from "../catalyst/dialog.tsx";
import { AttendanceGrid } from "../../features/attendance /attendanceGrid.tsx";
import { IAttendance } from "../../../types/attendance.ts";
import { IClassWithCourseAndScenesAndAttendance } from "../../types/class.ts";

interface Props {
  handleClose: (rows: IAttendance[]) => void;
  _class: IClassWithCourseAndScenesAndAttendance | null;
  isOpen: boolean;
}

export const AttendanceGridDialog = (props: Props) => {
  const { _class } = props;
  const gridRef = useRef<AgGridReact | null>(null);

  if (props._class === null) {
    return <p>No Class!</p>;
  }

  const handleClose = () => {
    const rows: IAttendance[] = [];
    gridRef.current?.api.forEachNode((node) => rows.push(node.data));
    if (
      props._class?.attendances &&
      rows.length === props._class.attendances.length &&
      rows.every(
        (item, index) =>
          item.status === props._class?.attendances[index].status,
      )
    ) {
      props.handleClose(rows);
      return;
    }
  };

  const handleClassEditClick = () => {
    console.log("edit class", props._class);
  };

  return (
    <Dialog open={props.isOpen} onClose={handleClose} size="4xl">
      <DialogBody>
        <div>
          <h1 className="text-2xl font-semibold text-left">Attendance</h1>
          <div>
            <div className="space-y-4 mx-auto">
              <div className="flex justify-end">
                <Button onClick={handleClassEditClick}>
                  Edit Class Details
                </Button>
              </div>
            </div>
          </div>
        </div>
        <AttendanceGrid gridRef={gridRef} />
      </DialogBody>
    </Dialog>
  );
};
