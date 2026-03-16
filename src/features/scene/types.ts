import { type ActionArgs } from 'xstate';
import { type Events } from './events.ts';
import { IScene } from '../../types/scene.ts';

export interface Scope {
	events: Events;
	context: ISceneContext;
}

export interface ISceneContext {
	loading: boolean;
	data: IScene[];
	_sceneId: number;
	_classId: number;
	_scenesToReorder: { sceneId: number; order: number; classId: number }[];
}

export interface XStateInput {
	input: { context: ISceneContext; event: Events };
}

export type Args<TEvent extends Events> = ActionArgs<
	ISceneContext,
	TEvent,
	Events
>;

export interface Input<T> {
	input: {
		context: ISceneContext;
		event: T;
	};
}
