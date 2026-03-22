import { assign, fromPromise, setup } from 'xstate';
import { useMachine } from '@xstate/react';

export type Context = {
	isOpen: boolean;
};

export type Events = {
	type: 'ON_OPEN';
} | {
	type: 'ON_CLOSE';
} | {
	type: 'ON_TOGGLE';
};

export const dialogMachine = setup({
	types: {
		context: {} as Context,
		events: {} as Events,
		input: {} as Partial<Context>,
	},
	actions: {},
}).createMachine({
	context: () => ({
		isOpen: false,
	}),
	initial: '$_IDLE',
	states: {
		$_IDLE: {
			entry: assign({ isOpen: false }),
			on: {
				ON_OPEN: {
					actions: assign({ isOpen: true }),
					target: '$_OPEN',
				},
			},
		},
		$_OPEN: {
			entry: assign({ isOpen: true }),
			on: {
				ON_CLOSE: {
					target: '$_IDLE',
					actions: assign({ isOpen: false }),
				},
			},
		},
	},
});

export const useDialogMachine = (id: string) => {
	const [state, send] = useMachine(dialogMachine, {
		id: id,
		input: { isOpen: false },
	});
	const handleOpenDialog = () => {
		send({ type: 'ON_OPEN' });
	};

	const handleCloseDialog = () => {
		send({ type: 'ON_CLOSE' });
	};

	return {
		isOpen: state.context.isOpen,
		handleOpenDialog,
		handleCloseDialog,
	};
};
