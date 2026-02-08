import { TransformUsersToOptions } from '../../utils/helperfunctions/users.ts';
import { ROUTE_NAMES } from '../../utils/routes.ts';
import {
	deleteData,
	getData,
	getOneData,
	patchData,
	postData,
} from '../../utils/service.ts';
import { SceneResponseEvent } from '../scene/events.ts';
import { UsersResponseEvent } from '../user/events.ts';
import {
	CourseResponseEvent,
	type CoursesResponseEvent,
	ON_DELETE,
	ON_GET_INSTRUCTORS,
	ON_GET_ONE,
	ON_SUBMIT,
	ON_UPDATE,
} from './events.ts';
import { Input } from './types.ts';

export const COURSE_API_ROUTES = {
	get: async (): Promise<CoursesResponseEvent> => {
		return await getData(ROUTE_NAMES.course);
	},
	getOne: async (
		{ input }: Input<ON_GET_ONE>,
	): Promise<CourseResponseEvent> => {
		return await getOneData(ROUTE_NAMES.course, {
			pathParams: {
				id: input.event.payload.id.toString(),
			},
		});
	},
	create: async ({ input }: Input<ON_SUBMIT>): Promise<SceneResponseEvent> => {
		return await postData(ROUTE_NAMES.course, {
			data: input.event.values,
		});
	},
	patch: async ({ input }: Input<ON_UPDATE>): Promise<SceneResponseEvent> => {
		return await patchData(ROUTE_NAMES.course, {
			pathParams: { id: input.event.values.id.toString() },
			data: input.event.values,
		});
	},
	delete: async ({ input }: Input<ON_DELETE>) => {
		return await deleteData(ROUTE_NAMES.course, {
			pathParams: { id: input.event.payload.id.toString() },
		});
	},
	getInstructors: async (): Promise<UsersResponseEvent> => {
		return await getData(ROUTE_NAMES.user, {
			params: { role: 'INSTRUCTOR' },
			transformResponse: TransformUsersToOptions,
		});
	},
};
