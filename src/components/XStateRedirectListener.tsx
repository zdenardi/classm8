import { useEffect } from 'react';
import { useNavigate } from 'react-router';

/**
 * Component that listens for XState redirect events and performs navigation
 * This allows state machines to trigger redirects without directly coupling to React Router
 */
export const XStateRedirectListener = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const handleRedirect = (event: Event) => {
			const customEvent = event as CustomEvent<{ path: string }>;
			const { path } = customEvent.detail;
			console.log('XState redirect to:', path);
			navigate(path);
		};

		globalThis.addEventListener('xstate-redirect', handleRedirect);

		return () => {
			globalThis.removeEventListener('xstate-redirect', handleRedirect);
		};
	}, [navigate]);

	return null;
};

