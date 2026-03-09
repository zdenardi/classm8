import { assign, fromPromise, setup } from 'xstate';
import { IClassWithCourseAndScenes } from '../types/class.ts';
import { CLASS_API_CALLS } from '../features/class/api.ts';

export const classAndScenesMachine = setup({
	actors: {
		getClasses: fromPromise(CLASS_API_CALLS.get),
	},
	actions: {},
	types: {
		context: {} as { data: IClassWithCourseAndScenes[]; loading: boolean },
		output: {} as {
			data: IClassWithCourseAndScenes[];
		},
	},
}).createMachine({
	output: ({ context }) => ({ data: context.data }),
	context: () => ({
		data: [],
		loading: false,
	}),
	initial: '$_LOAD',
	states: {
		$_IDLE: {
			entry: assign({ loading: false }),
			on: {
				ON_GET_CLASSES: {
					actions: assign({ loading: true }),
					target: '$_LOAD',
				},
			},
		},
		$_LOAD: {
			invoke: {
				id: 'get',
				src: 'getClasses',
				input: (inputProps) => inputProps,
				onDone: {
					actions: assign({
						data: ({ event }) => event.output,
					}),
					target: '$_END',
				},
				onError: {
					target: '$_END',
					actions: [() => console.log('There was an error ON_LOAD ')],
				},
			},
		},
		$_END: {
			entry: ((context) => console.log({ context })),
			type: 'final',
			output: ({ context }) => ({
				data: context.data,
			}),
		},
	},
});
