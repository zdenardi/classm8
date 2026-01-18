import { assign, fromPromise, setup } from 'xstate';
import { type Events, RegistrationResponseEvent } from './events.ts';
import { type Context } from './types.ts';
import { AUTH_API_CALLS } from '../../stateMachines/api.ts';

export const registrationMachine = setup({
	actors: {
		createUser: fromPromise(AUTH_API_CALLS.create),
	},
	types: {
		context: {} as Context,
		events: {} as Events,
		input: {} as Partial<Context>,
		output: {} as {
			id: number;
			firstName: string;
			lastName: string;
			email: string;
			role: 'STUDENT' | 'ADMIN' | 'MODERATOR' | 'INSTRUCTOR';
		},
	},
}).createMachine({
	context: ({ input }) => ({
		loading: false,
		firstName: input?.firstName || '',
		lastName: input?.lastName || '',
		email: input?.email || '',
	}),
	initial: '$_IDLE',
	states: {
		$_IDLE: {
			on: {
				SUBMIT: {
					target: '$_SUBMIT_USER',
				},
			},
		},
		$_SUBMIT_USER: {
			invoke: {
				id: 'submitUser',
				src: 'createUser',
				input: (inputArgs) => inputArgs,
				onDone: {
					target: '$_SUCCESS',
					actions: [
						assign({
							firstName: ({ event }) => event.output.data.firstName,
							lastName: ({ event }) => event.output.data.lastName,
							email: ({ event }) => event.output.data.email,
						}),
					],
				},
				onError: {
					target: '$_IDLE',
					actions: [() => {
						console.log('Woopsie');
					}],
				},
			},
		},
		$_SUCCESS: {
			type: 'final',
			output: ({ event }) => {
				const { output } = event as RegistrationResponseEvent;
				return {
					id: output.id,
					firstName: output.firstName,
					lastName: output.lastName,
					email: output.email,
					role: output.role as
						| 'STUDENT'
						| 'ADMIN'
						| 'MODERATOR'
						| 'INSTRUCTOR',
				};
			},
		},
	},
});
