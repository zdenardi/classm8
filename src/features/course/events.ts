import { type DoneActorEvent } from 'xstate';
import { IScene } from '../../types/scene.ts';
import { ICourseWithStudentsAndClasses } from '../../types/course.ts';
import { UserResponseEvent } from '../user/events.ts';

export type ON_LOAD = { type: 'ON_LOAD' };

export type ON_GET_ONE = {
	type: 'ON_GET_ONE';
	payload: { id: number };
};

export type ON_GET_INSTRUCTORS = {
	type: 'ON_GET_INSTRUCTORS';
};

export type ON_SUBMIT = {
	type: 'ON_SUBMIT';
	values: Omit<IScene, 'id'>;
};
export type ON_UPDATE = {
	type: 'ON_UPDATE';
	values: IScene;
};
export type ON_DELETE = {
	type: 'ON_DELETE';
	payload: { id: number };
};

export type CRUD_EVENTS = ON_LOAD | ON_SUBMIT | ON_UPDATE | ON_DELETE;

export type CoursesResponseEvent = DoneActorEvent<
	ICourseWithStudentsAndClasses[]
>;
export type CourseResponseEvent = DoneActorEvent<ICourseWithStudentsAndClasses>;

export type RESPONSE_EVENTS =
	| CoursesResponseEvent
	| CourseResponseEvent
	| UserResponseEvent;

export type Events = CRUD_EVENTS | RESPONSE_EVENTS | ON_GET_INSTRUCTORS;
