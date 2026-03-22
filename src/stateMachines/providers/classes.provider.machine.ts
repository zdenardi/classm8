import { assign, fromPromise, sendParent, setup } from 'xstate';
import { CLASS_API_CALLS } from '../../features/class/api.ts';
import { IClassWithCourseAndScenesAndAttendance } from '../../types/class.ts';

export const classesProviderMachine = setup({
	actors: {
		getClasses: fromPromise(CLASS_API_CALLS.get),
		patchClass: fromPromise(CLASS_API_CALLS.patch),
	},
	actions: {},
	types: {
		context: {} as {
			data: IClassWithCourseAndScenesAndAttendance[];
			loading: boolean;
		},
		output: {} as {
			data: IClassWithCourseAndScenesAndAttendance[];
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
				ON_GET_CLASSES: {
					target: '$_GET',
					actions: [
						() => console.log('GETTING CLASSES'),
						assign({ loading: true }),
					],
				},
			},
		},
		$_GET: {
			invoke: {
				id: 'getClasses',
				src: 'getClasses',
				onDone: {
					actions: [
						assign({
							data: ({ event }) => event.output,
						}),
						sendParent(({ event }) => ({
							type: 'ON_CLASSES_LOADED',
							data: event.output,
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
