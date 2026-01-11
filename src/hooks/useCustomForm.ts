import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';

/**
 * Custom hook to wrap react-hook-form's useForm hook
 * ensures that validation modes are consistent across the app
 */
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCustomForm<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TFormValues extends Record<string, any> = Record<string, any>,
>(
	options?: UseFormProps<TFormValues>,
): UseFormReturn<TFormValues> {
	const defaultOptions: UseFormProps<TFormValues> = {
		mode: 'onBlur',
		reValidateMode: 'onChange',
		...options,
	};

	const formMethods = useForm<TFormValues>(defaultOptions);
	return formMethods;
}
