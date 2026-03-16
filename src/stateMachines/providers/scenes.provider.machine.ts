import { assign, fromPromise, sendParent, setup } from 'xstate';
import { SCENE_API_CALLS } from '../../features/scene/api.ts';
import { IScene, ISceneWithClasses } from '../../types/scene.ts';

export type OnGetScenes = {
	type: 'ON_GET_SCENES';
};
export type OnCreateScene = {
	type: 'ON_CREATE_SCENE';
	values: Omit<IScene, 'id' | 'createdAt' | 'updatedAt'>;
};

export type OnApproveScene = {
	type: 'ON_APPROVE_SCENE';
	sceneId: number;
	classId: number;
};

export type OnDeleteScene = {
	type: 'ON_DELETE_SCENE';
	classId: number;
	sceneId: number;
};

export type OnReorderScenes = {
	type: 'ON_REORDER_SCENES';
	classId: number;
	scenes: { sceneId: number; order: number; classId: number }[];
};

export type Events =
	| OnGetScenes
	| OnCreateScene
	| OnApproveScene
	| OnDeleteScene
	| OnReorderScenes;
export const scenesProviderMachine = setup({
	actors: {
		getScenes: fromPromise(SCENE_API_CALLS.get),
		createScene: fromPromise(SCENE_API_CALLS.create),
		patchScene: fromPromise(SCENE_API_CALLS.patch),
		deleteScene: fromPromise(SCENE_API_CALLS.delete),
		reorderScenes: fromPromise(SCENE_API_CALLS.reorder),
	},
	actions: {},
	types: {
		context: {} as {
			data: ISceneWithClasses[];
			loading: boolean;
			pendingCreate: Omit<IScene, 'id' | 'createdAt' | 'updatedAt'> | null;
			_sceneId: number;
			_classId: number;
			_scenesToReorder: { sceneId: number; order: number; classId: number }[];
		},
		events: {} as Events,
		output: {} as {
			data: ISceneWithClasses[];
		},
	},
}).createMachine({
	context: () => ({
		data: [],
		loading: false,
		pendingCreate: null,
		_sceneId: -1,
		_classId: -1,
		_scenesToReorder: [],
	}),
	initial: '$_IDLE',
	states: {
		$_IDLE: {
			entry: assign({ loading: false }),
			on: {
				ON_GET_SCENES: {
					target: '$_GET',
					actions: [
						() => console.log('GETTING SCENES'),
						assign({ loading: true }),
					],
				},
				ON_CREATE_SCENE: {
					target: '$_CREATE',
					actions: [
						() => console.log('CREATING SCENE'),
						assign({
							loading: true,
							pendingCreate: ({ event }) => event.values,
						}),
					],
				},
				ON_APPROVE_SCENE: {
					target: '$_APPROVE',
					actions: [
						() => console.log('APPROVING SCENE'),
						assign({
							loading: true,
							_sceneId: ({ event }) => event.sceneId,
							_classId: ({ event }) => event.classId,
						}),
					],
				},
				ON_DELETE_SCENE: {
					target: '$_DELETE',
					actions: [
						() => console.log('DELETING SCENE'),
						assign({
							loading: true,
							_sceneId: ({ event }) => event.sceneId,
							_classId: ({ event }) => event.classId,
						}),
					],
				},
				ON_REORDER_SCENES: {
					target: '$_REORDER',
					actions: [
						() => console.log('REORDERING SCENES'),
						assign({
							loading: true,
							_classId: ({ event }) => event.classId,
							_scenesToReorder: ({ event }) => event.scenes,
						}),
					],
				},
			},
		},
		$_TRIGGER_UPDATE: {
			entry: [
				assign({ loading: false }),
				sendParent(() => ({
					type: 'ON_UPDATE_DATA',
				})),
			],
			exit: assign({ loading: false }),
			target: '$_IDLE',
		},
		$_GET: {
			invoke: {
				id: 'getScenes',
				src: 'getScenes',
				onDone: {
					actions: [
						assign({
							data: ({ event }) => event.output.output,
						}),
						sendParent(({ event }) => ({
							type: 'ON_SCENES_LOADED',
							data: event.output.output,
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
		$_CREATE: {
			invoke: {
				id: 'createScene',
				src: 'createScene',
				input: ({ context }) => ({
					context,
					event: { type: 'ON_SUBMIT' as const, values: context.pendingCreate! },
				}),
				onDone: {
					target: '$_TRIGGER_UPDATE',
				},
				onError: {
					target: '$_IDLE',
					actions: [() => console.log('There was an error CREATING a scene ')],
				},
			},
		},
		$_APPROVE: {
			invoke: {
				id: 'patchScene',
				src: 'patchScene',
				input: ({ context }) => ({
					context,
					event: {
						type: 'ON_UPDATE' as const,
						payload: { id: context._sceneId },
					},
				}),
				onDone: {
					target: '$_TRIGGER_UPDATE',
				},
				onError: {
					target: '$_IDLE',
					actions: [
						({ event }) =>
							console.log('There was an error APPROVING a scene ', event.error),
					],
				},
			},
		},
		$_DELETE: {
			invoke: {
				id: 'deleteScene',
				src: 'deleteScene',
				input: ({ context }) => ({
					context,
					event: {
						type: 'ON_DELETE' as const,
						payload: { id: context._sceneId },
					},
				}),
				onDone: {
					target: '$_TRIGGER_UPDATE',
				},
				onError: {
					target: '$_IDLE',
					actions: [() => console.log('There was an error DELETING a scene ')],
				},
			},
		},
		$_REORDER: {
			invoke: {
				id: 'reorderScenes',
				src: 'reorderScenes',
				input: ({ context }) => ({
					context,
					event: {
						type: 'ON_REORDER_SCENES' as const,
						classId: context._classId,
						scenes: context._scenesToReorder,
					},
				}),
				onDone: {
					target: '$_TRIGGER_UPDATE',
				},
				onError: {
					target: '$_IDLE',
					actions: [() => console.log('There was an error REORDERING scenes ')],
				},
			},
		},
	},
});
