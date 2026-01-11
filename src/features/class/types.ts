import { type ActionArgs } from 'xstate';
import { type ClassWithCourseAndScenes } from '../../types/class.ts';
import { type Events } from './events.ts';

export interface Scope {
	events: Events;
	context: Context;
}

export interface Context {
	loading: boolean;
	data: ClassWithCourseAndScenes[];
}

export interface XStateInput {
	input: { context: Context; event: Events };
}

export type Args<TEvent extends Events> = ActionArgs<
	Context,
	TEvent,
	Events
>;
