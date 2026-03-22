import { ICourse } from './course.ts';
import { IScene, ISceneWithPerformers } from './scene.ts';
import { IAttendance } from '../../types/attendance.ts';
import { IUser } from './user.ts';

export interface IClass {
	id: number;
	courseId: number;
	location: string;
	notes: string | null;
	streamingLink: string;
	startDate: Date | string;
	endDate: Date | string;
	instructor: IUser;
}

export interface IClassWithCourseAndScenesAndAttendance extends IClass {
	course: ICourse;
	scenes: {
		scene: ISceneWithPerformers;
		approved: boolean;
		order: number;
	}[];
	attendances: IAttendance[];
	class: IClass;
}
