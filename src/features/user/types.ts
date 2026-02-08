import { type ActionArgs, ActorRefFrom } from 'xstate';
import { type Events } from './events.ts';
import { IUser } from '../../types/user.ts';
import { createBaseCrudMachine } from '../../base-crud/baseCrudMachine.ts';

export interface Scope {
	events: Events;
	context: IUserContext;
}

export interface IUserContext {
	loading: boolean;
	data: IUser[];
	crudMachine: ActorRefFrom<typeof createBaseCrudMachine>;
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
