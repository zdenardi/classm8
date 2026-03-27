import { useState } from "react";
import { ColDef, ICellRenderer, ICellRendererParams } from "ag-grid-community";
import { IUser } from "../../types/user.ts";
import { Badge } from "../../components/catalyst/badge.tsx";
import {
  Listbox,
  ListboxLabel,
  ListboxOption,
} from "../../components/catalyst/listbox.tsx";
import { AttendanceStatus, IAttendance } from "../../../types/attendance.ts";

const attendanceOptions = [
  { value: "ABSENT", label: "Absent", color: "red" as const },
  { value: "ATTENDED", label: "Attended", color: "green" as const },
  { value: "EXCUSED", label: "Excused", color: "amber" as const },
];

function AttendanceCell(params: ICellRendererParams<IAttendance>) {
  const [status, setStatus] = useState(params?.data?.status ?? "ABSENT");
  const handleChange = (value: AttendanceStatus) => {
    setStatus(value);
    params.node.setDataValue("status", value);
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Listbox value={status} onChange={handleChange} className="w-auto">
        {attendanceOptions.map((opt) => (
          <>
            <ListboxOption
              key={opt.value}
              value={opt.value}
              className="w-full flex justify-center"
            >
              <Badge color={opt.color}>
                <div className="flex items-center justify-center">
                  <p className="text-center">{opt.label}</p>
                </div>
              </Badge>
            </ListboxOption>
          </>
        ))}
      </Listbox>
    </div>
  );
}

export const AttendanceColumns: ColDef<IAttendance>[] = [
  {
    field: "id",
    hide: true,
  },
  {
    field: "user.firstName",
    headerName: "First Name",
    cellStyle: {
      padding: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  },
  {
    field: "user.lastName",
    headerName: "Last Name",
    cellStyle: {
      padding: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  },
  {
    field: "status",
    headerName: "Attendance",
    cellRenderer: AttendanceCell,
    flex: 1,
    cellStyle: {
      padding: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "200px",
    },
  },
];
