import { Description, Label } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import { FieldErrors, FieldValues } from 'react-hook-form';
import FieldError from '../FieldError';

import { ReactNode } from 'react';
import Tooltip from '../Tooltip';

interface FormLabelProps {
  label?: string;
  description?: string;
  tooltip?: ReactNode;
  errors: FieldErrors<FieldValues> | undefined;
  name: string;
  /* If required a * will be added to the label */
  required?: boolean;
}

export const FormLabel = ({
  label,
  description,
  errors,
  name,
  tooltip,
  required,
}: FormLabelProps) => {
  return (
    <span className="flex grow flex-col">
      <div className="flex items-center">
        <>
          {label && (
            <Label
              as="span"
              passive
              className="body-text-sb text-left text-content-primary pt-1 pb-1"
            >
              {label}
              {required && <span className="pl-[1px]">*</span>}
            </Label>
          )}
          {tooltip && <Tooltip content={tooltip} />}
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => <FieldError message={message} className="ml-1 " />}
          />
        </>
      </div>
      {description && (
        <Description as="span" className="body-text text-left text-gray-500 ">
          {description}
        </Description>
      )}
    </span>
  );
};
