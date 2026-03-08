import { assign, fromPromise, sendParent, setup } from 'xstate';
import { SCENE_API_CALLS } from '../../features/scene/api.ts';
import { ISceneWithClasses } from '../../types/scene.ts';

export const scenesProviderMachine = setup({
	actors: {
		getScenes: fromPromise(SCENE_API_CALLS.get),
	},
	actions: {},
	types: {
		context: {} as {
			data: ISceneWithClasses[];
			loading: boolean;
		},
		output: {} as {
			data: ISceneWithClasses[];
		},
	},
}).createMachine({
	context: () => ({
		data: [],
		loading: false,
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
	},
});
