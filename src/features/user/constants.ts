import type { ColDef } from 'ag-grid-community';
import { IUser } from '../../types/user.ts';

export const UsersColumns: ColDef<IUser>[] = [
	{
		field: 'id',
		hide: true,
	},
	{
		field: 'firstName',
		headerName: 'First Name',
	},
	{
		field: 'lastName',
		headerName: 'Last Name',
	},
	{
		field: 'email',
		headerName: 'Email Address',
	},
];
