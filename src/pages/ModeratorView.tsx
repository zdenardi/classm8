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
import { Button } from "../components/catalyst/button.tsx";
import { AttendanceGridDialog } from "../components/dialogs/AttendanceGridDialog.tsx";

export const ModeratorView = () => {
  const { isOpen, handleOpenDialog, handleCloseDialog } = useDialogMachine(
    "attendanceGridDialog",
  );
  const { sendClassClicked, sendUpdateAttendance, _class } = useModeratorView();

  const handleRowClick = (
    event: RowClickedEvent<IClassWithCourseAndScenesAndAttendance>,
  ) => {
    if (!event.data) {
      return;
    }
    sendClassClicked(event.data);

    handleOpenDialog();
  };

  const handleClose = (rows: IAttendance[]) => {
    sendUpdateAttendance(rows);
    handleCloseDialog();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <ClassesGrid onRowClicked={handleRowClick} />
      </div>
      <AttendanceGridDialog
        handleClose={handleClose}
        isOpen={isOpen}
        _class={_class}
      />
    </>
  );
};
