import { type ISceneContext } from './types.ts';
import { type Events, type ScenesResponseEvent } from './events.ts';

export const setData = (
	args: { context: ISceneContext; event: Events },
): Partial<ISceneContext> => {
	const event = args.event as ScenesResponseEvent;
	return {
		data: event.output,
	};
};
