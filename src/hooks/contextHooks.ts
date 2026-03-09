import { useSelector } from '@xstate/react';
import { UserContext } from '../App.tsx';
import { IClassWithCourseAndScenes } from '../types/class.ts';
import { Context } from '../stateMachines/userState.machine.ts';
import { IUser } from '../types/user.ts';

/**
 * Selects UserContext
 */

export const selectUserContext = (state: { context: Context }) => {
	return {
		classes: state.context.classes,
		roster: state.context.roster,
		loading: state.context.loading,
		classesProvider: state.context.classesProvider,
		usersProvider: state.context.usersProvider,
	};
};

type ClassRefResult = {
	loading: boolean;
	classes: IClassWithCourseAndScenes[];
};

export const useClasses = (): ClassRefResult => {
	const { classes, classesProvider } = useSelector(
		UserContext.useActorRef(),
		selectUserContext,
	);
	const { loading } = useSelector(classesProvider, (state) => state.context);
	return { loading, classes };
};

type RosterRefResult = {
	loading: boolean;
	roster: IUser[];
};

export const useRoster = (): RosterRefResult => {
	const { roster, usersProvider } = useSelector(
		UserContext.useActorRef(),
		selectUserContext,
	);
	const { loading } = useSelector(usersProvider, (state) => state.context);
	return { loading, roster };
};
