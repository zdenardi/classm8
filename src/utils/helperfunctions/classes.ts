import { OptionType } from '../../../types/common.ts';
import { IClassWithCourseAndScenes } from '../../types/class.ts';

export const transformClassesToOptions = (
	classes: IClassWithCourseAndScenes[],
): OptionType[] => {
	return classes.map((c) => transformClassToOption(c));
};

export const transformClassToOption = (
	classObj: IClassWithCourseAndScenes,
): OptionType => {
	return {
		label: `${
			new Date(classObj.startDate).toLocaleDateString('en-US', {
				month: '2-digit',
				day: '2-digit',
			})
		} - ${classObj.course.title}`,
		value: classObj.id.toString(),
	};
};
