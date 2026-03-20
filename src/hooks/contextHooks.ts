import { useSelector } from '@xstate/react';
import { UserContext } from '../App.tsx';
import { IClassWithCourseAndScenes } from '../types/class.ts';
import { Context } from '../stateMachines/userState.machine.ts';
import { IUser } from '../types/user.ts';
import { IProfile } from '../../types/profile.ts';
import { ISceneWithClasses } from '../types/scene.ts';
import { ActorRefFrom } from 'npm:xstate@^5.25.0';
import { scenesProviderMachine } from '../stateMachines/providers/scenes.provider.machine.ts';
import { ICourseWithStudentsAndClasses } from '../types/course.ts';
import { courseProviderMachine } from '../stateMachines/providers/courses.provider.machine.ts';

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
		scenesProvider: state.context.scenesProvider,
		profileProvider: state.context.profileProvider,
		courseProvider: state.context.courseProvider,
		profile: state.context.profile,
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

type ProfileRefResult = {
	loading: boolean;
	profile: IProfile | undefined;
};

export const useProfile = (): ProfileRefResult => {
	const { profile, profileProvider } = useSelector(
		UserContext.useActorRef(),
		selectUserContext,
	);
	const { loading } = useSelector(profileProvider, (state) => state.context);
	return { loading, profile };
};

type ScenesRefResult = {
	loading: boolean;
	scenes: ISceneWithClasses[];
	scenesProvider: ActorRefFrom<typeof scenesProviderMachine>;
};

export const useScenes = (): ScenesRefResult => {
	const { profile, scenesProvider } = useSelector(
		UserContext.useActorRef(),
		selectUserContext,
	);

	const { loading } = useSelector(scenesProvider, (state) => state.context);
	return { loading, scenes: profile?.scenes || [], scenesProvider };
};

type CourseRefResult = {
	loading: boolean;
	courseProvider: ActorRefFrom<typeof courseProviderMachine>;
};

export const useCourses = (): CourseRefResult => {
	const { courseProvider } = useSelector(
		UserContext.useActorRef(),
		selectUserContext,
	);
	const { loading } = useSelector(courseProvider, (state) => state.context);
	return { loading, courseProvider };
};

export const useAuthState = () => {
	const userRef = UserContext.useActorRef();
	const state = useSelector(userRef, (snapshot) => snapshot.value);
	const { token } = useSelector(userRef, (snapshot) => snapshot.context);

	return {
		state,
		isAuthenticated: state === '$_AUTHENTICATED',
		isUnauthenticated: state === '$_UNAUTHENTICATED',
		isCheckingRegistration: state === '$_CHECK_REGISTRATION',
		isRegistering: state === '$_REGISTRATION',
		token,
	};
};
