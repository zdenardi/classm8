import { Fragment, useState } from "react";
import { ColDef, ICellRenderer, ICellRendererParams } from "ag-grid-community";
import { IUser } from "../../types/user.ts";
import { Badge } from "../../components/catalyst/badge.tsx";
import { AttendanceStatus, IAttendance } from "../../../types/attendance.ts";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx/lite";

const attendanceOptions = [
  { value: "ABSENT", label: "Absent", color: "red" as const },
  { value: "ATTENDED", label: "Attended", color: "green" as const },
  { value: "EXCUSED", label: "Excused", color: "amber" as const },
];

function AttendanceCell(params: ICellRendererParams<IAttendance>) {
  const { data } = params;
  console.log(data);
  const [status, setStatus] = useState(params?.data?.status ?? "ABSENT");
  const handleChange = (value: AttendanceStatus) => {
    setStatus(value);
    params.node.setDataValue("status", value);
  };
  return (
    <div>
      <Listbox value={status} onChange={handleChange}>
        <ListboxButton>
          <Badge
            color={
              attendanceOptions.find(
                (opt) =>
                  opt.value.toLocaleLowerCase() === status.toLocaleLowerCase(),
              )?.color
            }
          >
            {status.toLocaleUpperCase()}
          </Badge>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className="bg-primary rounded-xl shadow-lg ring-1 ring-zinc-950/10 p-1 z-50 backdrop-blur-xl flex flex-col items-center"
        >
          {attendanceOptions.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.label}
              as={Fragment}
            >
              {({ focus, selected }) => (
                <div className={clsx("flex gap-2", focus && "bg-blue-100")}>
                  <CheckIcon
                    className={clsx("size-5", !selected && "invisible")}
                  />
                  <Badge color={option.color}>
                    {option.label.toLocaleUpperCase()}
                  </Badge>
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
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
      alignItems: "left",
      width: "100%",
    },
  },
  {
    field: "user.lastName",
    headerName: "Last Name",
    cellStyle: {
      padding: 0,
      display: "flex",
      justifyContent: "left",
      alignItems: "left",
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
      display: "block",
      justifyContent: "center",
      alignItems: "center",
    },
  },
];
