import { ClassWithCourseAndScenes } from '../../types/class.ts';

export interface Context {
	loading: boolean;
	data: ClassWithCourseAndScenes[];
}
