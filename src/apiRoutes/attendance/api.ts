import { IClassWithCourseAndScenesAndAttendance } from '../../types/class.ts';
import { ROUTE_NAMES } from '../../utils/routes.ts';
import { patchData } from '../../utils/service.ts';
import { Input, ON_UPDATE_ATTENDANCE } from './types.ts';

export const ATTENDANCE_API_CALLS = {
	patch: async (
		{ input }: Input<ON_UPDATE_ATTENDANCE>,
	): Promise<IClassWithCourseAndScenesAndAttendance> => {
		console.debug('PATCHING ATTENDANCE FROM API', input);
		return await patchData(ROUTE_NAMES.attendance, {
			pathParams: { id: input.classId.toString() },
			data: input.event.values,
		});
	},
};
