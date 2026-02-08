import { assign, fromPromise, setup } from 'xstate';
import { type Events } from './events.ts';
import { type IUserContext } from './types.ts';
import { setData } from './actions.ts';
import { USER_API_CALLS } from './api.ts';
import { createBaseCrudMachine } from '../../stateMachines/base-crud/baseCrudMachine.ts';
import { IUser } from '../../types/user.ts';

const userCrudMachine = createBaseCrudMachine<IUser, IUser>({});

export const usersMachine = setup({
	actors: {
		get: fromPromise(USER_API_CALLS.get),
		userCrudMachine: userCrudMachine,
	},
	types: {
		context: {} as IUserContext,
		events: {} as Events,
		input: {} as Partial<IUserContext>,
	},
	actions: {
		setData: assign(setData),
	},
}).createMachine({
	context: () => ({
		loading: false,
		data: [],
		crudMachine: userCrudMachine,
	}),
	initial: '$_IDLE',
	states: {
		$_IDLE: {
			entry: assign({ loading: false }),
			on: {
				ON_LOAD: {
					target: '$_GET',
					actions: assign({ loading: true }),
				},
			},
		},
		$_GET: {
			invoke: {
				id: 'getUsers',
				src: 'get',
				input: (inputProps) => inputProps,
				onDone: {
					actions: ['setData'],
					target: '$_IDLE',
				},
				onError: {
					actions: [
						() => {
							console.log('Error on getting Scenes');
						},
					],
				},
			},
		},
	},
});
