import { IClassWithCourseAndScenes } from '../src/types/class.ts';
import { ICourse } from '../src/types/course.ts';
import { ISceneWithClasses } from '../src/types/scene.ts';
import { IUser } from '../src/types/user.ts';

export interface IProfile extends IUser {
	classes: IClassWithCourseAndScenes[];
	courses: ICourse[];
	scenes: ISceneWithClasses[];
}
