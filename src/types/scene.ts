import { IClass } from './class.ts';
import { IUser } from './user.ts';

export interface IScene {
	id: number;
	duration: number;
	title: string;
	type: SceneTypes;
	classId: number;
	sceneId: number;
}

export type SceneTypes =
	| 'PLAY'
	| 'FILM'
	| 'MONOLOGUE'
	| 'SONG'
	| 'TELEVISION'
	| 'OTHER';

export interface ISceneWithClasses extends IScene {
	classes: IClass[];
	performers: IUser[];
}
