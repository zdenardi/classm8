import { RowClickedEvent } from "ag-grid-community";
import { ClassesGrid } from "../features/class/ClassGrid.tsx";
import { Dialog, DialogBody } from "../components/catalyst/dialog.tsx";
import { useDialogMachine } from "../stateMachines/dialog.machine.ts";
import { AttendanceGrid } from "../features/attendance /attendanceGrid.tsx";
import { IClassWithCourseAndScenesAndAttendance } from "../types/class.ts";
import { useModeratorView } from "../hooks/contextHooks.ts";
import { useRef } from "react";
import { IAttendance } from "../../types/attendance.ts";
import { AgGridReact } from "ag-grid-react";

export const ModeratorView = () => {
  const { isOpen, handleOpenDialog, handleCloseDialog } = useDialogMachine(
    "attendanceGridDialog",
  );
  const { sendClassClicked, sendUpdateAttendance, _class } = useModeratorView();

  const gridRef = useRef<AgGridReact | null>(null);
  const handleRowClick = (
    event: RowClickedEvent<IClassWithCourseAndScenesAndAttendance>,
  ) => {
    if (!event.data) {
      return;
    }
    sendClassClicked(event.data);

    handleOpenDialog();
  };
  const handleClose = () => {
    const rows: IAttendance[] = [];
    gridRef.current?.api.forEachNode((node) => rows.push(node.data));
    if (
      _class?.attendances &&
      rows.length === _class.attendances.length &&
      rows.every(
        (item, index) => item.status === _class.attendances[index].status,
      )
    ) {
      handleCloseDialog();
      return;
    }
    sendUpdateAttendance(rows);
    handleCloseDialog();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <ClassesGrid onRowClicked={handleRowClick} />
      </div>
      <Dialog open={isOpen} onClose={handleClose} size="4xl">
        <DialogBody>
          <AttendanceGrid gridRef={gridRef} />
        </DialogBody>
      </Dialog>
    </>
  );
};
