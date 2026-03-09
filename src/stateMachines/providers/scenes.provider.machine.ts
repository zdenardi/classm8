import { assign, fromPromise, sendParent, setup } from 'xstate';
import { SCENE_API_CALLS } from '../../features/scene/api.ts';
import { IScene, ISceneWithClasses } from '../../types/scene.ts';

export type OnGetScenes = {
	type: 'ON_GET_SCENES';
};
export type OnCreateScene = {
	type: 'ON_CREATE_SCENE';
	values: Omit<IScene, 'id' | 'createdAt' | 'updatedAt'>;
};

export type Events = OnGetScenes | OnCreateScene;
export const scenesProviderMachine = setup({
	actors: {
		getScenes: fromPromise(SCENE_API_CALLS.get),
		createScene: fromPromise(SCENE_API_CALLS.create),
	},
	actions: {},
	types: {
		context: {} as {
			data: ISceneWithClasses[];
			loading: boolean;
			pendingCreate: Omit<IScene, 'id' | 'createdAt' | 'updatedAt'> | null;
		},
		events: {} as Events,
		output: {} as {
			data: ISceneWithClasses[];
		},
	},
}).createMachine({
	context: () => ({
		data: [],
		loading: false,
		pendingCreate: null,
	}),
	initial: '$_IDLE',
	states: {
		$_IDLE: {
			entry: assign({ loading: false }),
			on: {
				ON_GET_SCENES: {
					target: '$_GET',
					actions: [
						() => console.log('GETTING SCENES'),
						assign({ loading: true }),
					],
				},
				ON_CREATE_SCENE: {
					target: '$_CREATE',
					actions: [
						() => console.log('CREATING SCENE'),
						assign({
							loading: true,
							pendingCreate: ({ event }) => event.values,
						}),
					],
				},
			},
		},
		$_GET: {
			invoke: {
				id: 'getScenes',
				src: 'getScenes',
				onDone: {
					actions: [
						assign({
							data: ({ event }) => event.output.output,
						}),
						sendParent(({ event }) => ({
							type: 'ON_SCENES_LOADED',
							data: event.output.output,
						})),
					],
					target: '$_IDLE',
				},
				onError: {
					target: '$_IDLE',
					actions: [() => console.log('There was an error GETTING classes ')],
				},
			},
		},
		$_CREATE: {
			invoke: {
				id: 'createScene',
				src: 'createScene',
				input: ({ context }) => ({
					context: { loading: context.loading, data: context.data },
					event: { type: 'ON_SUBMIT' as const, values: context.pendingCreate! },
				}),
				onDone: {
					target: '$_GET',
				},
				onError: {
					target: '$_IDLE',
					actions: [() => console.log('There was an error CREATING a scene ')],
				},
			},
		},
	},
});
