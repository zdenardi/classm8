import {
	type ActorRefFrom,
	assign,
	DoneActorEvent,
	fromPromise,
	setup,
} from 'xstate';
import { actingClassMachine } from '../features/class/class.machine.ts';
import {
	ACTING_CLASS_STATE,
	COURSES_STATE,
	SCENES_STATE,
} from '../constants/xstateSustem.ts';
import { AUTH_API_CALLS } from './api.ts';
import { IUser } from '../types/user.ts';
import { registrationMachine } from '../features/registration/registration.machine.ts';
import { scenesMachine } from '../features/scene/scene.machine.ts';
import { coursesMachine } from '../features/course/course.machine.ts';

export type UserContext = {
	actingClassRef: ActorRefFrom<typeof actingClassMachine>;
	sceneRef: ActorRefFrom<typeof scenesMachine>;
	courseRef: ActorRefFrom<typeof coursesMachine>;
	token: string | undefined;
	loading: boolean;
	profile: {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		role: 'STUDENT' | 'ADMIN' | 'MODERATOR' | 'INSTRUCTOR';
	} | undefined;
};

export type ON_LOAD = { type: 'ON_LOAD' };
export type ON_USER_SIGNED_IN = {
	type: 'ON_USER_SIGNED_IN';
};
export type ON_CHECK_REGISTRATION = {
	type: 'ON_CHECK_REGISTRATION';
};
export type RedirectResponse = {
	redirect: string;
	message: string;
};

export type ClassesResponseEvent = DoneActorEvent<
	IUser | RedirectResponse
>;

export type Events = ON_LOAD | ON_USER_SIGNED_IN | ON_CHECK_REGISTRATION;

// Helper to emit redirect event
export const emitRedirect = (path: string) => {
	globalThis.dispatchEvent(
		new CustomEvent('xstate-redirect', { detail: { path } }),
	);
};

export const userState = setup({
	types: { context: {} as UserContext, events: {} as Events },
	actors: {
		actingClassRef: actingClassMachine,
		sceneRef: scenesMachine,
		courseRef: coursesMachine,
		registrationRef: registrationMachine,
		checkRegistration: fromPromise(AUTH_API_CALLS.get),
	},
}).createMachine({
	context: ({ spawn }) => ({
		actingClassRef: spawn('actingClassRef', {
			id: ACTING_CLASS_STATE,
			systemId: ACTING_CLASS_STATE,
			input: undefined,
		}),
		sceneRef: spawn('sceneRef', {
			id: SCENES_STATE,
			systemId: SCENES_STATE,
			input: undefined,
		}),
		courseRef: spawn('courseRef', {
			id: COURSES_STATE,
			systemId: COURSES_STATE,
			input: undefined,
		}),
		registrationRef: registrationMachine,
		token: undefined,
		loading: false,
		profile: undefined,
	}),
	initial: '$_IDLE',
	states: {
		$_IDLE: {
			on: {
				ON_USER_SIGNED_IN: {
					actions: [
						assign({ loading: false }),
					],
					target: '$_LOAD_APP',
				},
				ON_CHECK_REGISTRATION: {
					target: '$_CHECK_REGISTRATION',
				},
			},
		},
		$_LOAD_APP: {
			entry: [
				({ context }) => context.actingClassRef.send({ type: 'ON_LOAD' }),
			],
			target: '$_IDLE',
		},
		$_CHECK_REGISTRATION: {
			invoke: {
				id: 'checkRegistration',
				src: 'checkRegistration',
				input: (inputProps) => inputProps,
				onDone: [
					{
						guard: ({ event }) => {
							const data = event.output.data;
							return data && typeof data === 'object' && 'redirect' in data;
						},
						target: '$_REGISTRATION',
						actions: [
							({ event }) => {
								const data = event.output.data as RedirectResponse;
								console.log('Redirect needed:', data.redirect);
								console.log('Message:', data.message);
								// Emit redirect event
								emitRedirect('/register');
							},
						],
					},
					{
						target: '$_LOAD_APP',
						actions: [() => console.log('Load!')],
					},
				],
				onError: {
					target: '$_IDLE',
					actions: [
						(e) => console.log(e),
					],
				},
			},
		},
		$_REGISTRATION: {
			invoke: {
				id: 'registrationMachine',
				src: 'registrationRef',
				input: ({ context }) => ({
					// Pass any initial data to registration machine
					firstName: context.profile?.firstName || '',
					lastName: context.profile?.lastName || '',
					email: context.profile?.email || '',
				}),
				onDone: {
					target: '$_LOAD_APP',
					actions: [
						assign({
							profile: ({ event }) => event.output,
						}),
						() => {
							console.log('Registration Complete');
							// Redirect back to home after successful registration
							// emitRedirect('/');
						},
					],
				},
				onError: {
					target: '$_IDLE',
					actions: [(e) => console.log('Registration error:', e)],
				},
			},
		},
	},
});
