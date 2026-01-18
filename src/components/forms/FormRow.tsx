import { Field } from '@headlessui/react';
import classNames from 'classnames';
import { ReactNode } from 'react';

export const FormRow = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Field className={classNames('flex flex-col gap-2 text-grey-100', className)}>{children}</Field>
  );
};
