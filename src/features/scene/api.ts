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
			pathParams: { id: input.event.values.id.toString() },
			data: input.event.values,
		});
	},
	delete: async ({ input }: Input<ON_DELETE>) => {
		return await deleteData(ROUTE_NAMES.scene, {
			pathParams: { id: input.event.payload.id.toString() },
		});
	},
};
