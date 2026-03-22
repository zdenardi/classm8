import { assign, fromPromise, sendParent, setup } from 'xstate';
import { IClassWithCourseAndScenesAndAttendance } from '../../types/class.ts';
import { ATTENDANCE_API_CALLS } from '../../apiRoutes/attendance/api.ts';
import { AttendanceStatus } from '../../../types/attendance.ts';

export type OnUpdateAttendance = {
	type: 'ON_UPDATE_ATTENDANCE';
	classId: number;
	values: { userId: number; status: AttendanceStatus }[];
};

export type Events = OnUpdateAttendance;

export type AttendanceContext = {
	data: IClassWithCourseAndScenesAndAttendance[];
	loading: boolean;
	pendingUpdate: { userId: number; status: AttendanceStatus }[] | null;
	classId: number | null;
};

export const attendanceProviderMachine = setup({
	actors: {
		patchAttendance: fromPromise(ATTENDANCE_API_CALLS.patch),
	},
	actions: {},
	types: {
		context: {} as AttendanceContext,
		events: {} as Events,
		output: {} as {
			data: IClassWithCourseAndScenesAndAttendance[];
		},
	},
}).createMachine({
	context: () => ({
		data: [],
		loading: false,
		pendingUpdate: null,
		classId: null,
	}),
	initial: '$_IDLE',
	states: {
		$_IDLE: {
			entry: assign({ loading: false }),
			on: {
				ON_UPDATE_ATTENDANCE: {
					target: '$_PATCH',
					actions: [
						() => console.log('PATCHING ATTENDANCE'),
						assign({
							loading: true,
							classId: ({ event }) => event.classId,
							pendingUpdate: ({ event }) => event.values,
						}),
					],
				},
			},
		},
		$_PATCH: {
			invoke: {
				id: 'patchAttendance',
				src: 'patchAttendance',
				input: ({ context }) => ({
					classId: context.classId!,
					event: {
						type: 'ON_UPDATE' as const,
						values: context.pendingUpdate,
					},
				}),
				onDone: {
					target: '$_TRIGGER_UPDATE',
				},
				onError: {
					target: '$_IDLE',
					actions: [
						() => console.log('There was an error PATCHING attendance '),
					],
				},
			},
		},
		$_TRIGGER_UPDATE: {
			entry: [
				sendParent(() => ({
					type: 'ON_UPDATE_DATA',
				})),
			],
			always: { target: '$_IDLE' },
		},
	},
});
