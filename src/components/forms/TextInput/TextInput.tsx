import { Input } from "@headlessui/react";
import classNames from "classnames";
import { ChangeEvent } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { FormFieldProps } from "../interfaces.tsx";
import { createFormFieldStyles } from "../../../constants/styles.ts";
import { FormLabel } from "../FormLabel.tsx";

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends FormFieldProps<TFieldValues, TName> {
  autoComplete?: string;
  type?: string;
  onChange?: (input: ChangeEvent<HTMLInputElement>) => void;
}
export const TextInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Props<TFieldValues, TName>,
) => {
  const {
    name,
    description,
    disabled,
    cyTag,
    label,
    className,
    placeholder,
    autoComplete,
    type,
    tooltip,
    onChange: customOnChange,
    required,
    flagged,
  } = props;
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={name}
      render={({ field }) => {
        const value = field.value || "";
        return (
          <>
            <FormLabel
              label={label}
              description={description}
              errors={errors}
              name={name}
              tooltip={tooltip}
              required={required}
            />
            <div data-cy={cyTag}>
              <Input
                {...field}
                value={value}
                autoComplete={autoComplete}
                className={classNames(
                  createFormFieldStyles(flagged, disabled),
                  className,
                )}
                onChange={(e) => {
                  field.onChange(e);
                  customOnChange?.(e);
                }}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
              />
            </div>
          </>
        );
      }}
    />
  );
};
