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
					actions: [
						({ event }) => console.log(event.payload),
						assign({
							firstName: ({ event }) => event.payload.firstName,
							lastName: ({ event }) => event.payload.lastName,
							email: ({ event }) => event.payload.email,
						}),
					],
				},
			},
		},
		$_SUBMIT_USER: {
			invoke: {
				id: 'submitUser',
				src: 'createUser',
				input: ({ context }) => {
					console.log(context.firstName);
					return {
						firstName: context.firstName,
						lastName: context.lastName,
						email: context.email,
					};
				},
				onDone: {
					target: '$_SUCCESS',
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
			entry: [() => console.log('Registration Complete')],
			type: 'final',
			output: ({ event }) => {
				const { output } = event as RegistrationResponseEvent;
				console.log({ event });
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
