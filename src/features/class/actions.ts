import { type Context } from './types.ts';
import { type ClassesResponseEvent, type Events } from './events.ts';

export const setData = (
	args: { context: Context; event: Events },
): Partial<Context> => {
	const event = args.event as ClassesResponseEvent;
	return {
		data: event.output,
	};
};
