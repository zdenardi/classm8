export interface IAttendance {
	id: number;
	userId: number;
	classId: number;
	status: AttendanceStatus;
	user: {
		firstName: string;
		lastName: string;
	};
}

export type AttendanceStatus = 'ATTENDED' | 'ABSENT' | 'EXCUSED';
