import { type DoneActorEvent } from 'xstate';
import { User } from '../../types/user.ts';

export type ON_OPEN = { type: 'ON_OPEN' };
export type ON_CLOSE = { type: 'ON_CLOSE' };
export type SUBMIT_REGISTRATION = {
	type: 'SUBMIT';
	payload: { firstName: string; lastName: string; email: string };
};

export type RegistrationResponseEvent = DoneActorEvent<
	User
>;

export type RESPONSE_EVENTS = RegistrationResponseEvent;

export type Events = ON_OPEN | ON_CLOSE | SUBMIT_REGISTRATION | RESPONSE_EVENTS;
