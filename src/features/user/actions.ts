import { type IUserContext } from './types.ts';
import { type Events, UsersResponseEvent } from './events.ts';

export const setData = (
	args: { context: IUserContext; event: Events },
): Partial<IUserContext> => {
	const event = args.event as UsersResponseEvent;
	return {
		data: event.output,
	};
};
