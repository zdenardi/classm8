export const ROUTE_NAMES = {
	class: 'classes',
	auth: 'auth',
} as const;

export const CLASSES_ROUTES = {
	get: '/classes',
};

export const AUTH_ROUTES = {
	get: '/auth',
};

export const ROUTES = {
	classes: CLASSES_ROUTES,
	auth: AUTH_ROUTES,
};
