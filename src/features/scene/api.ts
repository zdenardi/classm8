import { ROUTE_NAMES } from '../../utils/routes.ts';
import {
	deleteData,
	getData,
	getOneData,
	patchData,
	postData,
} from '../../utils/service.ts';
import {
	ON_DELETE,
	ON_GET_ONE,
	ON_REORDER_SCENES,
	ON_SUBMIT,
	ON_UPDATE,
	SceneResponseEvent,
	type ScenesResponseEvent,
} from './events.ts';
import { Input } from './types.ts';

export const SCENE_API_CALLS = {
	get: async (): Promise<ScenesResponseEvent> => {
		return await getData(ROUTE_NAMES.scene);
	},
	getOne: async ({ input }: Input<ON_GET_ONE>): Promise<SceneResponseEvent> => {
		return await getOneData(ROUTE_NAMES.scene, {
			pathParams: {
				id: input.event.payload.id.toString(),
			},
		});
	},
	create: async ({ input }: Input<ON_SUBMIT>): Promise<SceneResponseEvent> => {
		return await postData(ROUTE_NAMES.scene, {
			data: input.event.values,
		});
	},
	patch: async ({ input }: Input<ON_UPDATE>): Promise<SceneResponseEvent> => {
		return await patchData(ROUTE_NAMES.scene, {
			pathParams: { id: input.context._sceneId.toString() },
			data: { approved: true },
		});
	},
	delete: async ({ input }: Input<ON_DELETE>) => {
		return await deleteData(ROUTE_NAMES.scene, {
			pathParams: { id: input.context._sceneId.toString() },
		});
	},
	reorder: async ({ input }: Input<ON_REORDER_SCENES>) => {
		return await patchData(ROUTE_NAMES.scene, {
			pathParams: { id: `reorder/${input.context._classId.toString()}` }, // this can be done better...but nice workaround for now
			data: input.context._scenesToReorder,
		});
	},
};
