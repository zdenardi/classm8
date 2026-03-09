import type { ColDef } from 'ag-grid-community';
import { IScene } from '../../types/scene.ts';

export const ScenesColumns: ColDef<IScene>[] = [
	{
		field: 'id',
		hide: true,
	},
	{
		field: 'title',
		headerName: 'Title',
	},
	{
		field: 'duration',
		headerName: 'Duration',
	},
	{
		field: 'type',
		headerName: 'Type',
	},
];
