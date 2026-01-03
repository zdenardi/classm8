import type { ColDef } from "ag-grid-community";
import { ClassWithCourseAndScenes } from "../../types/class.ts";

export const ActingClassColumns: ColDef<ClassWithCourseAndScenes>[] = [
  {
    field: "id",
    hide: true,
  },
  {
    field: "course.title",
    headerName: "Title",
  },
  {
    field: "course.instructor.lastName",
    headerName: "Instructor",
  },
  {
    field: "course.title",
    headerName: "Instructor",
  },
];
