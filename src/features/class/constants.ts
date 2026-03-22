import type { ColDef } from 'ag-grid-community';
import type { IClassWithCourseAndScenes } from '../../types/class.ts';

export const ActingClassColumns: ColDef<IClassWithCourseAndScenes>[] = [
	{
		field: 'id',
		hide: true,
	},
	{
		field: 'course.title',
		headerName: 'Title',
	},
	{
		field: 'course.instructor.lastName',
		headerName: 'Instructor',
	},
	{
		field: 'course.title',
		headerName: 'Instructor',
	},
	{
		field: 'startDate',
		headerName: 'Date',
		valueGetter: (p) => {
			if (!p || !p.data?.startDate) return null;
			return new Date(p.data.startDate).toLocaleDateString('en-US', {
				month: '2-digit',
				day: '2-digit',
			});
		},
		cellStyle: {
			display: 'flex',
			alignItems: 'center',
		},
		flex: 0.5,
	},
];
