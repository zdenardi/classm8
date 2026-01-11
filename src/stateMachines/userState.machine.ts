import {
	type ActorRefFrom,
	assign,
	DoneActorEvent,
	fromPromise,
	setup,
} from 'xstate';
import { actingClassMachine } from '../features/class/class.machine.ts';
import { ACTING_CLASS_STATE } from '../constants/xstateSustem.ts';
import { AUTH_API_CALLS } from './api.ts';
import { User } from '../types/user.ts';

export type Context = {
	actingClassRef: ActorRefFrom<typeof actingClassMachine>;
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
export type ClassesResponseEvent = DoneActorEvent<
	User | {
		redirect?: string;
		message?: string;
	}
>;

export type Events = ON_LOAD | ON_USER_SIGNED_IN | ON_CHECK_REGISTRATION;

export const userState = setup({
	types: { context: {} as Context, events: {} as Events },
	actors: {
		actingClassRef: actingClassMachine,
		checkRegistration: fromPromise(AUTH_API_CALLS.get),
	},
}).createMachine({
	context: ({ spawn }) => ({
		actingClassRef: spawn('actingClassRef', {
			id: ACTING_CLASS_STATE,
			systemId: ACTING_CLASS_STATE,
			input: undefined,
		}),
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
						guard: ({ event }) => event.output.statusCode,
						actions: [() => {
							console.log('redirect!');
						}],
					},
					{
						target: '$_LOAD_APP',
					},
				],
			},
		},
	},
});
