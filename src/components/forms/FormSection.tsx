import { Fieldset } from '@headlessui/react';
import classNames from 'classnames';
import { ReactNode } from 'react';

interface FormSectionProps {
  componentsPerLine: number;
  children: ReactNode;
  className?: string;
}
export const FormSection = (props: FormSectionProps) => {
  const { children, componentsPerLine } = props;
  return (
    <Fieldset
      className={classNames(
        `grid grid-cols-${componentsPerLine} flex-col gap-2 text-grey-100`,
        props.className
      )}
    >
      {children}
    </Fieldset>
  );
};
Fir;
