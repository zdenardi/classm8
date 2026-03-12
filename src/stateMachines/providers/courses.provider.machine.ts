import { assign, fromPromise, sendParent, setup } from 'xstate';
import { COURSE_API_ROUTES } from '../../features/course/api.ts';
import { ICourseWithStudentsAndClasses } from '../../types/course.ts';
import { CourseFormValues } from '../../features/course/schema.ts';

export type OnGetCourses = {
	type: 'ON_GET_COURSES';
};
export type OnCreateCourse = {
	type: 'ON_CREATE_COURSE';
	values: CourseFormValues;
};

export const courseProviderMachine = setup({
	actors: {
		getCourses: fromPromise(COURSE_API_ROUTES.get),
		createCourse: fromPromise(COURSE_API_ROUTES.create),
	},
	actions: {},
	types: {
		context: {} as {
			data: ICourseWithStudentsAndClasses[];
			loading: boolean;
			pendingCreate: CourseFormValues | null;
		},
		output: {} as {
			data: ICourseWithStudentsAndClasses[];
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
				ON_GET_COURSES: {
					target: '$_GET',
					actions: [
						() => console.log('GETTING COURSES'),
						assign({ loading: true }),
					],
				},
				ON_CREATE_COURSE: {
					target: '$_CREATE',
					actions: [
						() => console.log('CREATING COURSE'),
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
				id: 'getCourses',
				src: 'getCourses',
				onDone: {
					actions: [
						assign({
							data: ({ event }) => event.output.output,
						}),
						sendParent(({ event }) => ({
							type: 'ON_COURSES_LOADED',
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
		$_CREATE: {
			invoke: {
				id: 'createCourse',
				src: 'createCourse',
				input: ({ context }) => ({
					context: {
						loading: context.loading,
						data: context.data,
						instructorOptions: [],
					},
					event: {
						type: 'ON_SUBMIT' as const,
						values: context.pendingCreate!,
					},
				}),
				onDone: {
					target: '$_GET',
				},
				onError: {
					target: '$_IDLE',
					actions: [() => console.log('There was an error CREATING a course ')],
				},
			},
		},
	},
});
