import type { ColDef } from 'ag-grid-community';
import { ICourseWithStudentsAndClasses } from '../../types/course.ts';

export const CourseColumns: ColDef<ICourseWithStudentsAndClasses>[] = [
	{
		field: 'id',
		hide: true,
	},
	{
		field: 'title',
		headerName: 'Title',
	},
	{
		field: 'studentLimit',
		headerName: 'Student Limit',
	},
	{
		field: 'instructor.lastName',
		headerName: 'Instructor',
	},
];
