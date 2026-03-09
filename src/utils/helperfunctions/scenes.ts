import { SceneFormValues } from '../../features/scene/schema.ts';
import { IScene } from '../../types/scene.ts';

export const transformSceneFormValuesToScene = (
	values: SceneFormValues,
): Omit<IScene, 'id' | 'createdAt' | 'updatedAt'> => {
	return {
		duration: values.duration,
		title: values.title,
		type: values.type,
		classId: Number(values.classID),
		performerIds: values.performerIDs || [],
	};
};
