import { type DoneActorEvent } from 'xstate';
import { IUser } from '../../types/user.ts';

export type ON_LOAD = { type: 'ON_LOAD' };

export type ON_GET_ONE = {
	type: 'ON_GET_ONE';
	payload: { id: number };
};

export type ON_SUBMIT = {
	type: 'ON_SUBMIT';
	values: Omit<IUser, 'id'>;
};
export type ON_UPDATE = {
	type: 'ON_UPDATE';
	values: IUser;
};
export type ON_DELETE = {
	type: 'ON_DELETE';
	payload: { id: number };
};

export type CRUD_EVENTS = ON_LOAD | ON_SUBMIT | ON_UPDATE | ON_DELETE;

export type UsersResponseEvent = DoneActorEvent<IUser[]>;
export type UserResponseEvent = DoneActorEvent<IUser>;

export type RESPONSE_EVENTS = UsersResponseEvent | UserResponseEvent;

export type Events = CRUD_EVENTS | RESPONSE_EVENTS;
