import { IClass } from './class.ts';
import { IUser } from './user.ts';

export interface ICourse {
	id: number;
	title: string;
	studentLimit?: number;
	instructorId: number;
	createdAt: Date | string;
	updatedAt: Date | string;
	instructor: IUser;
}

export interface ICourseWithStudentsAndClasses extends ICourse {
	classes: IClass[];
	students: IUser[];
}
