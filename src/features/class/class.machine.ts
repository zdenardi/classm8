import { assign, fromPromise, setup } from 'xstate';
import { type Events } from './events.ts';
import { type Context } from './types.ts';
import { CLASS_API_CALLS } from './api.ts';
import { setData } from './actions.ts';

export const actingClassMachine = setup({
	actors: {
		get: fromPromise(CLASS_API_CALLS.get),
	},
	types: {
		context: {} as Context,
		events: {} as Events,
		input: {} as Partial<Context>,
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
				id: 'getClasses',
				src: 'get',
				input: (inputProps) => inputProps,
				onDone: {
					actions: ['setData'],
					target: '$_IDLE',
				},
				onError: {
					actions: [
						() => {
							console.log('Error on Classes');
						},
					],
				},
			},
		},
	},
});
