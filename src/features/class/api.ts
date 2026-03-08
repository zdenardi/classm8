import { IClassWithCourseAndScenes } from '../../types/class.ts';
import { ROUTE_NAMES } from '../../utils/routes.ts';
import { getData } from '../../utils/service.ts';

export const CLASS_API_CALLS = {
	get: async (): Promise<IClassWithCourseAndScenes[]> => {
		console.debug('GETTING CLASSES FROM API');
		return await getData(ROUTE_NAMES.class);
	},
};
