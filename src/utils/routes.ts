export const ROUTE_NAMES = {
	auth: 'auth',
	class: 'classes',
	course: 'courses',
	scene: 'scenes',
	user: 'users',
} as const;

export const CLASSES_ROUTES = {
	get: '/classes',
	getOne: '/classes/:id',
	create: '/classes',
	update: '/classes/:id',
	delete: '/classes/:id',
};

export const COURSES_ROUTES = {
	get: 'courses',
	getOne: 'courses/:id',
	create: 'courses',
	patch: 'courses/:id',
	delete: 'courses/:id',
};

export const USERS_ROUTES = {
	get: 'users',
	getOne: 'users/:id',
	create: 'users',
	patch: 'users/:id',
	delete: 'users/:id',
	getInstructors: '/users/instructors',
};

export const SCENES_ROUTES = {
	get: 'scenes',
	getOne: 'scenes/:id',
	create: 'scenes',
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
};
