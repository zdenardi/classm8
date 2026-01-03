import { setup } from 'xstate';
import { Events } from './events.ts';
import { Context } from './types.ts';

export const actingClassSchema = setup({
	actors: {},
	types: {
		context: {} as Context,
		events: {} as Events,
		input: {} as Partial<Context>,
	},
	actions: {},
}).createMachine({
	context: ({ input, self }) => ({
		loading: false,
		data: [],
	}),
	initial: '$_IDLE',
	states: {
		$_IDLE: {
			on: {
				ON_LOAD: {
					target: '.$_GET',
				},
			},
		},
		$_GET: {},
	},
});
