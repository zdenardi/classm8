import { AttendanceStatus } from '../../../types/attendance.ts';

export type ON_UPDATE_ATTENDANCE = {
	type: 'ON_UPDATE';
	values: { userId: number; status: AttendanceStatus }[] | null;
};

export interface Input<T> {
	input: {
		classId: number;
		event: T;
	};
}
