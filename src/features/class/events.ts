import { DoneActorEvent } from 'xstate';
import { ClassWithCourseAndScenes } from '../../types/class.ts';

export type ON_LOAD = { type: 'ON_LOAD' };

export type CRUD_EVENTS = ON_LOAD;

export type ClassesResponseEvent = DoneActorEvent<ClassWithCourseAndScenes[]>;

export type Events = CRUD_EVENTS;
