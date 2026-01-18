export const ROUTE_NAMES = {
	class: 'classes',
	auth: 'auth',
} as const;

export const CLASSES_ROUTES = {
	get: '/classes',
};

export const AUTH_ROUTES = {
	get: '/auth',
	post: '/auth',
};

export const ROUTES = {
	classes: CLASSES_ROUTES,
	auth: AUTH_ROUTES,
};
