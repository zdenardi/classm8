import { ROUTE_NAMES } from '../../utils/routes.ts';
import { postData } from '../../utils/service.ts';
import { RegistrationResponseEvent } from './events.ts';

export const REGISTER_API_CALLS = {
	get: async (): Promise<RegistrationResponseEvent> => {
		return await postData(ROUTE_NAMES.auth);
	},
};
