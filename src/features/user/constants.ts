import type { ColDef } from 'ag-grid-community';
import { IUser } from '../../types/user.ts';
import { UserFormValues } from './schema.ts';

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

export const USER_TYPES = ['STUDENT', 'MODERATOR', 'INSTRUCTOR'] as const;

export const emptyForm: UserFormValues = {
	email: '',
	firstName: '',
	lastName: '',
	type: 'STUDENT',
};
