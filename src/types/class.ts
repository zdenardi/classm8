import { ICourse } from './course.ts';
import { IScene, ISceneWithPerformers } from './scene.ts';
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

export interface IClassWithCourseAndScenes extends IClass {
	course: ICourse;
	scenes: {
		scene: ISceneWithPerformers;
		approved: boolean;
		order: number;
	}[];
	class: IClass;
}
