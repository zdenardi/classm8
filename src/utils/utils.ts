import { useEffect } from 'react';
import { UserContext } from '../App.tsx';

export const StateLogger = () => {
	const userRef = UserContext.useActorRef();

	useEffect(() => {
		const subscription = userRef.subscribe((state) => {
			console.log('State changed:', state.value);
			console.log('Context:', state.context);
		});

		return () => subscription.unsubscribe();
	}, [userRef]);

	return null;
};
