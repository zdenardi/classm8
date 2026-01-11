import { User } from '../types/user.ts';
import { ROUTE_NAMES } from '../utils/routes.ts';
import { getData } from '../utils/service.ts';

export const AUTH_API_CALLS = {
	get: async (): Promise<{ data: User; statusCode: number }> => {
		const response = await getData(ROUTE_NAMES.auth);
		console.log(response);
		const data = await response.json();
		return { data, statusCode: response.status };
	},
};
