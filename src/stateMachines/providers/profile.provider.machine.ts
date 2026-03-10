import { assign, fromPromise, sendParent, setup } from 'xstate';
import { PROFILE_API_CALLS } from '../../utils/routes.ts';
import { IProfile } from '../../../types/profile.ts';

export const profileProviderMachine = setup({
	actors: {
		getProfile: fromPromise(PROFILE_API_CALLS.get),
	},
	actions: {},
	types: {
		context: {} as {
			data: IProfile[];
			loading: boolean;
		},
		output: {} as {
			data: IProfile[];
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
				ON_GET_PROFILE: {
					target: '$_GET',
					actions: [
						() => console.log('GETTING PROFILE'),
						assign({ loading: true }),
					],
				},
			},
		},
		$_GET: {
			invoke: {
				id: 'getProfile',
				src: 'getProfile',
				onDone: {
					actions: [
						assign({
							data: ({ event }) => event.output,
						}),
						({ event }) => console.log('PROFILE LOADED', event),
						sendParent(({ event }) => ({
							type: 'ON_PROFILE_LOADED',
							data: event.output,
						})),
					],
					target: '$_IDLE',
				},
				onError: {
					target: '$_IDLE',
					actions: [() => console.log('There was an error GETTING profile ')],
				},
			},
		},
	},
});
