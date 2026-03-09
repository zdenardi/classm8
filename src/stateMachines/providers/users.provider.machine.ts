import { assign, fromPromise, sendParent, setup } from 'xstate';
import { USER_API_CALLS } from '../../features/user/api.ts';
import { IUser } from '../../types/user.ts';

export const usersProviderMachine = setup({
	actors: {
		getRoster: fromPromise(USER_API_CALLS.get),
	},
	actions: {},
	types: {
		context: {} as {
			data: IUser[];
			loading: boolean;
		},
		output: {} as {
			data: IUser[];
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
				ON_GET_ROSTER: {
					target: '$_GET',
					actions: [
						() => console.log('GETTING USERS'),
						assign({ loading: true }),
					],
				},
			},
		},
		$_GET: {
			invoke: {
				id: 'getRoster',
				src: 'getRoster',
				onDone: {
					actions: [
						assign({
							data: ({ event }) => event.output.output,
						}),
						sendParent(({ event }) => ({
							type: 'ON_ROSTER_LOADED',
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
