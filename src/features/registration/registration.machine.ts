import { assign, fromPromise, setup } from 'xstate';
import { type Events } from './events.ts';
import { type Context } from './types.ts';
import { AUTH_API_CALLS } from '../../stateMachines/api.ts';

export const registrationMachine = setup({
	actors: {
		createUser: fromPromise(AUTH_API_CALLS.post),
	},
	types: {
		context: {} as Context,
		events: {} as Events,
		input: {} as Partial<Context>,
	},
}).createMachine({
	context: () => ({
		loading: false,
		firstName: '',
		lastName: '',
		email: '',
		openModal: false,
	}),
	initial: '$_IDLE',
	states: {
		$_IDLE: {
			on: {
				ON_OPEN: {
					actions: assign({ openModal: true }),
				},
				ON_CLOSE: {
					actions: assign({ openModal: false }),
				},
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
				onDone: {},
				onError: {},
			},
		},
	},
});
