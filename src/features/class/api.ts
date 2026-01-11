import { ROUTE_NAMES } from '../../utils/routes.ts';
import { getData } from '../../utils/service.ts';
import { type ClassesResponseEvent } from './events.ts';

export const CLASS_API_CALLS = {
	get: async (): Promise<ClassesResponseEvent> => {
		return await getData(ROUTE_NAMES.class);
	},
};
