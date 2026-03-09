import { assign, fromPromise, setup } from 'xstate';
import {
	closeModal,
	deleteData,
	openModal,
	resetLoading,
	resetState,
	setContext,
	setCreateSuccess,
	setDataToDelete,
	setDataToEdit,
	setGetSuccess,
	setPatchSuccess,
	toggleLoading,
} from './actions.ts';
import {
	DeleteEvent,
	Events as BaseEvents,
	GetEvent,
	PatchEvent,
	SendSharedContextEvent,
	SortEvent,
	SubmitEvent,
} from './events.ts';
import { BaseFormContext, BaseFormScope, DataItem } from './types.ts';

interface BaseCrudMachineProps<
	TData extends DataItem,
	TForm,
> {
	initialForm: Partial<TForm>;
	apiCalls: {
		get: (props: {
			input: BaseFormScope<BaseFormContext<TForm>, GetEvent>;
		}) => Promise<TData[]>;
		create: (props: {
			input: BaseFormScope<BaseFormContext<TForm>, SubmitEvent<TForm>>;
		}) => Promise<TData>;
		patch: (props: {
			input: BaseFormScope<BaseFormContext<TForm>, PatchEvent<TForm>>;
		}) => Promise<TData>;
		delete: (props: {
			input: BaseFormScope<BaseFormContext<TForm>, DeleteEvent>;
		}) => Promise<TData>;
	};
}

export const createBaseCrudMachine = <
	TData,
	TForm extends DataItem,
>(
	props: BaseCrudMachineProps<TData & DataItem, TForm>,
) => {
	type Context = BaseFormContext<TForm>;
	type Events =
		| BaseEvents
		| SortEvent<string>
		| SubmitEvent<TForm>
		| PatchEvent<TForm>
		| GetEvent
		| SendSharedContextEvent<Context>;
	const { initialForm, apiCalls } = props;
	return setup({
		actors: {
			getCall: fromPromise(apiCalls.get),
			createCall: fromPromise(apiCalls.create),
			updateCall: fromPromise(apiCalls.patch),
			deleteCall: fromPromise(apiCalls.delete),
		},
		types: {
			context: {} as BaseFormContext<TForm>,
			events: {} as Events,
			input: {} as Partial<Context>,
		},
		actions: {
			setContext: assign(setContext<Context>),
			toggleLoading: assign(toggleLoading<Context>),
			resetLoading: assign(resetLoading),
			openModal: assign(openModal),
			closeModal: assign(closeModal),
			setGetSuccess: assign(setGetSuccess<Context>),
			setCreateSuccess: assign(setCreateSuccess<Context>),
			setPatchSuccess: assign(setPatchSuccess<Context>),
			setItemToEdit: assign(setDataToEdit<Context>),
			setItemToDelete: assign(setDataToDelete<Context>),
			deleteItemFromContext: assign(deleteData<Context>),
			resetState: assign(resetState<Context>(initialForm)),
			log: () => console.log('FORM MACHINE - LOG ACTION triggered'),
		},
	}).createMachine({
		context: (props) => ({
			loading: false,
			pagination: {
				page: 1,
				pageSize: 5,
				total: 0,
			},
			modal: {
				edit: false,
				create: false,
			},
			form: initialForm,
			data: props.input.data || [],
			idToDelete: -1,
			providerId: props.input.providerId || -1,
		}),
		initial: '$_VIEW',
		on: {
			ON_OPEN_MODAL: {
				actions: 'openModal',
				target: '.$_FORM',
			},
			ON_CLOSE_MODAL: {
				actions: ['closeModal', 'resetState'],
				target: '.$_VIEW',
			},
			ON_SEND_SHARED_CONTEXT: {
				actions: ['setContext'],
			},
		},
		states: {
			$_VIEW: {
				on: {
					ON_LOAD: {
						actions: ['log', 'toggleLoading'],
						target: `$_LOAD`,
					},
					ON_ADD: {
						actions: ['openModal'],
						target: '$_FORM',
					},
					ON_EDIT: {
						actions: ['openModal', 'setItemToEdit'],
						target: '$_FORM',
					},
					ON_DELETE: {
						actions: ['setItemToDelete'],
						target: '$_SEND_DELETE',
					},
				},
			},
			$_FORM: {
				on: {
					ON_SUBMIT: { target: '$_SEND_CREATE' },
					ON_UPDATE: { target: '$_SEND_UPDATE' },
				},
			},
			$_SEND_CREATE: {
				invoke: {
					id: 'create',
					src: 'createCall',
					input: ({ context, event }) =>
						({ context, event }) as {
							context: Context;
							event: SubmitEvent<TForm>;
						},
					onDone: {
						target: '$_VIEW',
						actions: ['setCreateSuccess', 'resetState'],
					},
					onError: {
						target: '$_VIEW',
						actions: ['resetLoading'],
					},
				},
			},
			$_SEND_UPDATE: {
				invoke: {
					id: 'update',
					src: 'updateCall',
					input: ({ context, event }) =>
						({ context, event }) as {
							context: Context;
							event: PatchEvent<TForm>;
						},
					onDone: {
						target: '$_VIEW',
						actions: ['setPatchSuccess', 'resetState'],
					},
					onError: {
						target: '$_FORM',
						actions: ['resetLoading'],
					},
				},
			},
			$_SEND_DELETE: {
				invoke: {
					id: 'delete',
					src: 'deleteCall',
					input: ({ context, event }) =>
						({ context, event }) as { context: Context; event: DeleteEvent },
					onDone: {
						target: '$_VIEW',
						actions: ['deleteItemFromContext', 'resetLoading'],
					},
					onError: {
						target: '$_FORM',
						actions: ['resetLoading'],
					},
				},
			},
			$_LOAD: {
				invoke: {
					id: 'get',
					src: 'getCall',
					input: ({ context, event }) =>
						({ context, event }) as { context: Context; event: GetEvent },
					onDone: {
						target: '$_VIEW',
						actions: ['setGetSuccess', 'resetState'],
					},
					onError: {
						target: '$_VIEW',
						actions: ['resetState'],
					},
				},
			},
		},
	});
};
