import { assign, fromPromise, setup } from 'xstate';
import { type Events } from './events.ts';
import { type IUserContext } from './types.ts';
import { SCENE_API_CALLS } from './api.ts';
import { setData } from './actions.ts';

export const usersMachine = setup({
	actors: {
		get: fromPromise(SCENE_API_CALLS.get),
		getOne: fromPromise(SCENE_API_CALLS.getOne),
		create: fromPromise(SCENE_API_CALLS.create),
		delete: fromPromise(SCENE_API_CALLS.delete),
		patch: fromPromise(SCENE_API_CALLS.patch),
	},
	types: {
		context: {} as IUserContext,
		events: {} as Events,
		input: {} as Partial<IUserContext>,
	},
	actions: {
		setData: assign(setData),
	},
}).createMachine({
	context: () => ({
		loading: false,
		data: [],
	}),
	initial: '$_IDLE',
	states: {
		$_IDLE: {
			entry: assign({ loading: false }),
			on: {
				ON_LOAD: {
					target: '$_GET',
					actions: assign({ loading: true }),
				},
			},
		},
		$_GET: {
			invoke: {
				id: 'getScenes',
				src: 'get',
				input: (inputProps) => inputProps,
				onDone: {
					actions: ['setData'],
					target: '$_IDLE',
				},
				onError: {
					actions: [
						() => {
							console.log('Error on getting Scenes');
						},
					],
				},
			},
		},
	},
});
