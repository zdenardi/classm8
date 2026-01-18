import { FieldPath, FieldValues } from 'react-hook-form';

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  className?: string;
  description?: string;
  tooltip?: React.ReactNode;
  label?: string;
  cyTag?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  //for warning state
  flagged?: boolean;
}
