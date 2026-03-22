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
    <div className="w-full">
      <Listbox value={status} onChange={handleChange} className="w-full">
        {attendanceOptions.map((opt) => (
          <ListboxOption key={opt.value} value={opt.value}>
            <ListboxLabel>
              <Badge color={opt.color}>{opt.label}</Badge>
            </ListboxLabel>
          </ListboxOption>
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
  },
  {
    field: "user.lastName",
    headerName: "Last Name",
  },
  {
    field: "status",
    headerName: "Attendance",
    cellRenderer: AttendanceCell,
    minWidth: 250,
    flex: 1,
  },
];
