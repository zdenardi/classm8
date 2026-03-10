import {
	type ActorRefFrom,
	assign,
	DoneActorEvent,
	enqueueActions,
	fromPromise,
	sendTo,
	setup,
} from 'xstate';
import {
	CLASSES_PROVIDER,
	PROFILE_PROVIDER,
	SCENES_PROVIDER,
	USERS_PROVIDER,
} from '../constants/xstateSystem.ts';
import { AUTH_API_CALLS } from './api.ts';
import { IUser } from '../types/user.ts';
import { registrationMachine } from '../features/registration/registration.machine.ts';
import { coursesMachine } from '../features/course/course.machine.ts';
import { IClassWithCourseAndScenes } from '../types/class.ts';
import { classesProviderMachine } from './providers/classes.provider.machine.ts';
import { scenesProviderMachine } from './providers/scenes.provider.machine.ts';
import { ISceneWithClasses } from '../types/scene.ts';
import { usersProviderMachine } from './providers/users.provider.machine.ts';
import { IProfile } from '../../types/profile.ts';
import { profileProviderMachine } from './providers/profile.provider.machine.ts';
import { ICourse } from '../types/course.ts';

export type Context = {
	token: string | undefined;
	loading: boolean;
	roster: IUser[];
	classes: IClassWithCourseAndScenes[];
	scenes: ISceneWithClasses[];
	profile: {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		role: 'STUDENT' | 'ADMIN' | 'MODERATOR' | 'INSTRUCTOR';
		scenes: ISceneWithClasses[];
		classes: IClassWithCourseAndScenes[];
		courses: ICourse[];
	} | undefined;
	classesProvider: ActorRefFrom<typeof classesProviderMachine>;
	scenesProvider: ActorRefFrom<typeof scenesProviderMachine>;
	usersProvider: ActorRefFrom<typeof usersProviderMachine>;
	profileProvider: ActorRefFrom<typeof profileProviderMachine>;
};

export type ON_LOAD = { type: 'ON_LOAD' };
export type ON_USER_SIGNED_IN = {
	type: 'ON_USER_SIGNED_IN';
};
export type ON_CHECK_REGISTRATION = {
	type: 'ON_CHECK_REGISTRATION';
};

export type ON_USER_SIGNED_OUT = {
	type: 'ON_USER_SIGNED_OUT';
};
export type RedirectResponse = {
	redirect: string;
	message: string;
};

export type ClassesResponseEvent = DoneActorEvent<
	IUser | RedirectResponse
>;

export type ON_CLASSES_LOADED = {
	type: 'ON_CLASSES_LOADED';
	data: IClassWithCourseAndScenes[];
};

export type ON_SCENES_LOADED = {
	type: 'ON_SCENES_LOADED';
	data: ISceneWithClasses[];
};

export type ON_ROSTER_LOADED = {
	type: 'ON_ROSTER_LOADED';
	data: IUser[];
};

export type ON_PROFILE_LOADED = {
	type: 'ON_PROFILE_LOADED';
	data: IProfile;
};

export type Events =
	| ON_LOAD
	| ON_USER_SIGNED_IN
	| ON_CHECK_REGISTRATION
	| ON_CLASSES_LOADED
	| ON_SCENES_LOADED
	| ON_ROSTER_LOADED
	| ON_PROFILE_LOADED
	| ON_USER_SIGNED_OUT;

// Helper to emit redirect event
export const emitRedirect = (path: string) => {
	globalThis.dispatchEvent(
		new CustomEvent('xstate-redirect', { detail: { path } }),
	);
};

export const userState = setup({
	types: { context: {} as Context, events: {} as Events },
	actors: {
		courseRef: coursesMachine,
		registrationRef: registrationMachine,
		checkRegistration: fromPromise(AUTH_API_CALLS.get),
		classesProvider: classesProviderMachine,
		scenesProvider: scenesProviderMachine,
		usersProvider: usersProviderMachine,
		profileProvider: profileProviderMachine,
	},
}).createMachine({
	context: ({ spawn }) => ({
		classes: [],
		scenes: [],
		roster: [],
		token: undefined,
		loading: false,
		profile: undefined,
		classesProvider: spawn('classesProvider', { id: CLASSES_PROVIDER }),
		scenesProvider: spawn('scenesProvider', { id: SCENES_PROVIDER }),
		usersProvider: spawn('usersProvider', { id: USERS_PROVIDER }),
		profileProvider: spawn('profileProvider', { id: PROFILE_PROVIDER }),
	}),
	initial: '$_UNAUTHENTICATED',
	states: {
		$_UNAUTHENTICATED: {
			on: {
				ON_USER_SIGNED_IN: {
					actions: [
						assign({ loading: false }),
					],
					target: '$_CHECK_REGISTRATION',
				},
				ON_CHECK_REGISTRATION: {
					target: '$_CHECK_REGISTRATION',
				},
			},
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
						target: '$_AUTHENTICATED',
						actions: [() => console.log('Load!')],
					},
				],
				onError: {
					target: '$_UNAUTHENTICATED',
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
					target: '$_AUTHENTICATED',
					actions: [
						assign({
							profile: ({ event }) => ({
								...event.output,
								scenes: [],
								classes: [],
								courses: [],
							}),
						}),
						() => {
							console.log('Registration Complete');
							// Redirect back to home after successful registration
							// emitRedirect('/');
						},
					],
				},
				onError: {
					target: '$_UNAUTHENTICATED',
					actions: [(e) => console.log('Registration error:', e)],
				},
			},
		},

		$_AUTHENTICATED: {
			entry: [
				enqueueActions(({ context, enqueue }) => {
					if (context.classes.length === 0) {
						enqueue(
							sendTo(context.classesProvider, { type: 'ON_GET_CLASSES' }),
						);
					}
					if (context.scenes.length === 0) {
						enqueue(sendTo(context.scenesProvider, { type: 'ON_GET_SCENES' }));
					}
					if (context.roster.length === 0) {
						enqueue(sendTo(context.usersProvider, { type: 'ON_GET_ROSTER' }));
					}

					enqueue(
						sendTo(context.profileProvider, { type: 'ON_GET_PROFILE' }),
					);
				}),
			],
			on: {
				ON_CLASSES_LOADED: {
					actions: [
						assign({
							classes: ({ event }) => event.data,
						}),
					],
				},
				ON_SCENES_LOADED: {
					actions: [
						assign({
							scenes: ({ event }) => event.data,
						}),
						sendTo(({ context }) => context.profileProvider, { type: 'ON_GET_PROFILE' }),
					],
				},
				ON_ROSTER_LOADED: {
					actions: [
						assign({
							roster: ({ event }) => {
								return event.data.filter(
									(user) => user.role === 'STUDENT',
								);
							},
						}),
					],
				},
				ON_PROFILE_LOADED: {
					actions: [
						assign({
							profile: ({ context, event }) => ({
								...context.profile!,
								classes: event.data.classes,
								courses: event.data.courses,
								scenes: event.data.scenes,
							}),
						}),
						({ event }) => console.log('PROFILE LOADED', event),
					],
				},
				ON_USER_SIGNED_OUT: {
					target: '$_UNAUTHENTICATED',
					actions: [
						assign({
							classes: [],
							scenes: [],
							roster: [],
							loading: false,
						}),
					],
				},
			},
		},
	},
});
