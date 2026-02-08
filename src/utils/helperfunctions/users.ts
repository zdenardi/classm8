import { OptionType } from '../../../types/common.ts';
import { IUser } from '../../types/user.ts';

export const TransformUsersToOptions = (users: IUser[]): OptionType[] => {
	return users.map((user) => TransformUserToOption(user));
};

export const TransformUserToOption = (user: IUser): OptionType => {
	return {
		label: `${user.lastName}. ${user.firstName}`,
		value: user.id.toString(),
	};
};
