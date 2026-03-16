import { type ActionArgs } from 'xstate';
import { type IClassWithCourseAndScenes } from '../../types/class.ts';
import { type Events } from './events.ts';

export interface Scope {
	events: Events;
	context: Context;
}

export interface Context {
	loading: boolean;
	data: IClassWithCourseAndScenes[];
}

export interface XStateInput {
	input: { context: Context; event: Events };
}

export type Args<TEvent extends Events> = ActionArgs<
	Context,
	TEvent,
	Events
>;

export interface Input<T> {
	input: {
		context: IClassWithCourseAndScenes;
		event: T;
	};
}

export type ON_UPDATE = {
	type: 'ON_UPDATE';
	values: IClassWithCourseAndScenes;
};
