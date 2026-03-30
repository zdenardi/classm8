import type { ColDef } from "ag-grid-community";
import { ICourseWithStudentsAndClasses } from "../../types/course.ts";
import { IUser } from "../../types/user.ts";
import { OptionType } from "../../../types/common.ts";

export const CourseColumns: ColDef<ICourseWithStudentsAndClasses>[] = [
  {
    field: "id",
    hide: true,
  },
  {
    field: "title",
    headerName: "Title",
  },
  {
    field: "studentLimit",
    headerName: "Student Limit",
  },
  {
    field: "instructor.lastName",
    headerName: "Instructor",
  },
];

export const RosterColumns: ColDef<OptionType>[] = [
  {
    field: "value",
    hide: true,
  },

  {
    headerName: "Student Name",
    valueGetter: (p) => {
      if (!p || !p.data?.label) return null;
      return p.data.label;
    },
  },
];
