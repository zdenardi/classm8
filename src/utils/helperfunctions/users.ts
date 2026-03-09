import { OptionType } from '../../../types/common.ts';
import { IUser } from '../../types/user.ts';

export const transformUsersToOptions = (users: IUser[]): OptionType[] => {
	return users.map((user) => transformUserToOption(user));
};

export const transformUserToOption = (user: IUser): OptionType => {
	return {
		label: `${user.lastName}, ${user.firstName}`,
		value: user.id.toString(),
	};
};
