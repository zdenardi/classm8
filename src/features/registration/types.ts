import { type ActionArgs } from 'xstate';
import { type Events } from './events.ts';

export interface Scope {
	events: Events;
	context: Context;
}

export interface Context {
	loading: boolean;
	firstName: string;
	lastName: string;
	email: string;
}

export interface XStateInput {
	input: { context: Context; event: Events };
}

export type Args<TEvent extends Events> = ActionArgs<
	Context,
	TEvent,
	Events
>;
