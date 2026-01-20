import { type ActionArgs } from 'xstate';
import { type Events } from './events.ts';
import { IUser } from '../../types/user.ts';

export interface Scope {
	events: Events;
	context: IUserContext;
}

export interface IUserContext {
	loading: boolean;
	data: IUser[];
}

export interface XStateInput {
	input: { context: IUserContext; event: Events };
}

export type Args<TEvent extends Events> = ActionArgs<
	IUserContext,
	TEvent,
	Events
>;

export interface Input<T> {
	input: {
		context: IUserContext;
		event: T;
	};
}
