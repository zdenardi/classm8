import { DoneActorEvent } from 'npm:xstate@^5.25.0';
import { IProfile } from '../../types/profile.ts';
import { getData } from './service.ts';

export const ROUTE_NAMES = {
	auth: 'auth',
	class: 'classes',
	course: 'courses',
	scene: 'scenes',
	user: 'users',
	profile: 'profile',
} as const;

export const CLASSES_ROUTES = {
	get: '/classes',
	getOne: '/classes/:id',
	post: '/classes',
	update: '/classes/:id',
	delete: '/classes/:id',
};

export const COURSES_ROUTES = {
	get: 'courses',
	getOne: 'courses/:id',
	post: 'courses',
	patch: 'courses/:id',
	delete: 'courses/:id',
};

export const USERS_ROUTES = {
	get: 'users',
	getOne: 'users/:id',
	post: 'users',
	patch: 'users/:id',
	delete: 'users/:id',
	getInstructors: '/users/instructors',
};

export const PROFILE_ROUTES = {
	get: '/profile',
};

export const SCENES_ROUTES = {
	get: 'scenes',
	getOne: 'scenes/:id',
	post: 'scenes',
	patch: 'scenes/:id',
	delete: 'scenes/:id',
};

export const AUTH_ROUTES = {
	get: '/auth',
	post: '/auth',
};

export const ROUTES = {
	auth: AUTH_ROUTES,
	classes: CLASSES_ROUTES,
	courses: COURSES_ROUTES,
	scenes: SCENES_ROUTES,
	users: USERS_ROUTES,
	profile: PROFILE_ROUTES,
};

export type ProfileResponseEvent = DoneActorEvent<
	IProfile
>;

export const PROFILE_API_CALLS = {
	get: async (): Promise<IProfile> => {
		console.debug('GETTING PROFILE');
		return await getData(ROUTE_NAMES.profile);
	},
};
