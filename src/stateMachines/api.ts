import { IUser } from '../types/user.ts';
import { ROUTE_NAMES } from '../utils/routes.ts';
import { getData, postData } from '../utils/service.ts';
import { AxiosError, AxiosResponse } from 'axios';
import { RedirectResponse } from './userState.machine.ts';
import { Context } from '../features/registration/types.ts';
import {
	Events,
	SUBMIT_REGISTRATION,
} from '../features/registration/events.ts';

export const AUTH_API_CALLS = {
	get: async (): Promise<
		{ data: IUser | RedirectResponse; statusCode: number }
	> => {
		try {
			const response: AxiosResponse = await getData(ROUTE_NAMES.auth);
			const data = response.data;
			return { data, statusCode: response.status };
		} catch (error: unknown) {
			// Handle 300 status as success with redirect info
			if (error instanceof AxiosError && error.response?.status === 300) {
				return { data: error.response.data, statusCode: 300 };
			}
			throw error;
		}
	},
	create: async ({ input: { firstName, lastName, email } }: {
		input: {
			firstName: string;
			lastName: string;
			email: string;
		};
	}): Promise<IUser> => {
		console.log({ firstName, lastName, email });

		const result = await postData<IUser>(ROUTE_NAMES.auth, {
			data: {
				firstName: firstName,
				lastName: lastName,
				email: email,
			},
		});
		return result;
	},
};
