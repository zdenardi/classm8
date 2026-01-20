import { type ICourseContext } from './types.ts';
import { CoursesResponseEvent, type Events } from './events.ts';

export const setData = (
	args: { context: ICourseContext; event: Events },
): Partial<ICourseContext> => {
	const event = args.event as CoursesResponseEvent;
	return {
		data: event.output,
	};
};
