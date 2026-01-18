export const ERROR_MESSAGES = {
	REQUIRED: 'Required',
	INVALID_DATE: 'Invalid date',
	FUTURE_DATE: 'Date must be current or in the past',
	PAST_DATE: 'Date must be current or in the future',
	INVALID_ZIP_CODE: 'Invalid zip code',
	INVALID_START_END_DATES: '"Start Date" must be before "End Date"',
	INVALID_DATE_ORDER: (startDateLabel: string, endDateLabel: string) =>
		`"${startDateLabel}" must be before "${endDateLabel}"`,
	MAX_CHARACTER_LIMIT: (charLimit: number) =>
		`Must be ${charLimit} or less characters`,
	MIN_CHARACTER_LIMIT: (charLimit: number) =>
		`Must be at least ${charLimit} characters`,
};
