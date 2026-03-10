import { IClassWithCourseAndScenes } from './class.ts';
import { IUser } from './user.ts';

export interface IScene {
	id: number;
	duration: number;
	title: string;
	type: SceneTypes;
	classId: number;
	performerIds: number[];
}

export type SceneTypes =
	| 'PLAY'
	| 'FILM'
	| 'MONOLOGUE'
	| 'SONG'
	| 'TELEVISION'
	| 'OTHER';

export interface ISceneWithClasses extends IScene {
	classes: IClassWithCourseAndScenes[];
	performers: IUser[];
}

export interface ISceneWithPerformers extends IScene {
	performers: {
		user: IUser;
	}[];
}
