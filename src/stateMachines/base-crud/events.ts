import { ModalEvents } from '../types.ts';

export type GetEvent = { type: 'ON_GET' };

export type AddEvent = { type: 'ON_ADD' };
export type EditEvent = { type: 'ON_EDIT'; payload: { id: number } };

export type DeleteEvent = {
	type: 'ON_DELETE';
	payload: { id: number };
};

export type SubmitEvent<T> = {
	type: 'ON_SUBMIT';
	values: T;
};
export type PatchEvent<T> = {
	type: 'ON_UPDATE';
	values: T;
};

export type SortEvent<TSortByOptions> = {
	type: 'ON_SORT_TABLE';
	sortBy: TSortByOptions;
};

export type LoadEvent = {
	type: 'ON_LOAD';
};

export type SendSharedContextEvent<T> = {
	type: 'ON_SEND_SHARED_CONTEXT';
	values: Partial<T>;
};

export type DataEvents =
	| ModalEvents
	| GetEvent
	| AddEvent
	| EditEvent
	| DeleteEvent
	| LoadEvent;

export type Events = ModalEvents | DataEvents;
