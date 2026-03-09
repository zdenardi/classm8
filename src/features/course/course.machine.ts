import { assign, fromPromise, setup } from 'xstate';
import { type Events } from './events.ts';
import { type ICourseContext } from './types.ts';
import { COURSE_API_ROUTES } from './api.ts';
import { setData, setInstructors } from './actions.ts';

export const coursesMachine = setup({
	actors: {
		get: fromPromise(COURSE_API_ROUTES.get),
		getInstructors: fromPromise(
			COURSE_API_ROUTES.getInstructors,
		),
	},
	types: {
		context: {} as ICourseContext,
		events: {} as Events,
		input: {} as Partial<ICourseContext>,
	},
	actions: {
		setData: assign(setData),
		setInstructors: assign(setInstructors),
	},
}).createMachine({
	context: () => ({
		loading: false,
		data: [],
		instructorOptions: [],
	}),
	initial: '$_IDLE',
	on: {
		ON_GET_INSTRUCTORS: {
			target: '.$_GET_INSTRUCTORS',
		},
	},
	states: {
		$_IDLE: {
			entry: assign({ loading: false }),
			on: {
				ON_LOAD: {
					target: '$_GET_INSTRUCTORS',
					actions: assign({ loading: true }),
				},
			},
		},
		$_GET: {
			invoke: {
				id: 'getCourses',
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
		$_GET_INSTRUCTORS: {
			invoke: {
				id: 'getInstructors',
				src: 'getInstructors',
				input: (inputProps) => inputProps,
				onDone: {
					actions: ['setInstructors'],
					target: '$_GET',
				},
				onError: {
					actions: [
						() => {
							console.log('Error loading instructors');
						},
					],
				},
			},
		},
	},
});
