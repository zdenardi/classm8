import { IClassWithCourseAndScenes } from '../../types/class.ts';
import { ROUTE_NAMES } from '../../utils/routes.ts';
import { getData, patchData } from '../../utils/service.ts';
import { Input } from './types.ts';

export const CLASS_API_CALLS = {
	get: async (): Promise<IClassWithCourseAndScenes[]> => {
		console.debug('GETTING CLASSES FROM API');
		return await getData(ROUTE_NAMES.class);
	},
	patch: async (
		input: Input<ON_UPDATE>,
	): Promise<IClassWithCourseAndScenes> => {
		console.debug('PATCHING CLASS FROM API', input);
		return await patchData(ROUTE_NAMES.class, {
			pathParams: { id: input.id.toString() },
			data: input,
		});
	},
};
