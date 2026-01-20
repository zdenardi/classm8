import { type DoneActorEvent } from 'xstate';
import { type IClassWithCourseAndScenes } from '../../types/class.ts';

export type ON_LOAD = { type: 'ON_LOAD' };

export type CRUD_EVENTS = ON_LOAD;

export type ClassesResponseEvent = DoneActorEvent<IClassWithCourseAndScenes[]>;

export type RESPONSE_EVENTS = ClassesResponseEvent;

export type Events = CRUD_EVENTS | RESPONSE_EVENTS;
