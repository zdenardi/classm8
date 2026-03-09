import { type DoneActorEvent } from 'xstate';
import { IScene, ISceneWithClasses } from '../../types/scene.ts';

export type ON_LOAD = { type: 'ON_LOAD' };

export type ON_GET_ONE = {
	type: 'ON_GET_ONE';
	payload: { id: number };
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

export type ScenesResponseEvent = DoneActorEvent<ISceneWithClasses[]>;
export type SceneResponseEvent = DoneActorEvent<ISceneWithClasses>;

export type RESPONSE_EVENTS = ScenesResponseEvent | SceneResponseEvent;

export type Events = CRUD_EVENTS | RESPONSE_EVENTS;
