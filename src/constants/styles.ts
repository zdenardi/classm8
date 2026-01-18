export const ERROR_STYLE =
	' border-1 border-red-500 outline-red-500 text-red-500 focus:outline-red-500';
export const GRID_CONTAINER =
	'grid gap-[30px] mx-auto max-[1360px]:grid-cols-[repeat(6,100px)] max-[1360px]:w-[750px] min-[1360px]:grid-cols-[repeat(12,80px)] min-[1360px]:w-[1290px]';
export const HALF_WIDTH = 'max-[1360px]:col-span-3 min-[1360px]:col-span-6';
export const FULL_WIDTH = 'max-[1500px]:col-span-6 min-[1360px]:col-span-12';
export const ONE_THIRD_WIDTH =
	'max-[1360px]:col-span-2 min-[1360px]:col-span-4';
export const LG_HALF_SM_FULL =
	'max-[1360px]:col-span-6 min-[1360px]:col-span-6';
export const createFormFieldStyles = (
	flagged?: boolean,
	disabled?: boolean,
) => {
	return [
		'body-text placeholder:text-grey-700',
		'block w-full rounded-md p-3 outline-1 mt-0',
		'-outline-offset-1 focus:outline-2 focus:-outline-offset-2',
		flagged
			? ' border-1 border-warning outline-warning focus:outline-warning'
			: 'border-grey-100 outline-grey-100 focus:outline-grey-200',
		disabled ? 'bg-grey-900' : flagged ? 'bg-warning-50' : 'bg-grey-950',
	];
};
