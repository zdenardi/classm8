import { type ActionArgs } from 'xstate';
import { type Events } from './events.ts';
import { ICourseWithStudentsAndClasses } from '../../types/course.ts';

export interface Scope {
	events: Events;
	context: ICourseContext;
}

export interface ICourseContext {
	loading: boolean;
	data: ICourseWithStudentsAndClasses[];
}

export interface XStateInput {
	input: { context: ICourseContext; event: Events };
}

export type Args<TEvent extends Events> = ActionArgs<
	ICourseContext,
	TEvent,
	Events
>;

export interface Input<T> {
	input: {
		context: ICourseContext;
		event: T;
	};
}
