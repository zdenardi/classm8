import { assign, fromPromise, setup } from 'xstate';
import { type Events } from './events.ts';
import { type ICourseContext } from './types.ts';
import { COURSE_API_ROUTES } from './api.ts';
import { setData } from './actions.ts';

export const coursesMachine = setup({
	actors: {
		get: fromPromise(COURSE_API_ROUTES.get),
	},
	types: {
		context: {} as ICourseContext,
		events: {} as Events,
		input: {} as Partial<ICourseContext>,
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
