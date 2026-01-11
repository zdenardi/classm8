import { Field, Fieldset } from '@headlessui/react';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { StoryContext } from 'storybook/internal/csf';
import { GRID_CONTAINER, HALF_WIDTH } from '~/constants/styles';
import { useCustomForm } from '~/hooks/useCustomForm';

export const FormWrapper = ({
  children,
  context,
}: {
  children: React.ReactNode;
  context?: StoryContext;
}) => {
  const methods = useCustomForm({});
  const { setError, setValue } = methods;
  useEffect(() => {
    if (context?.parameters.error) {
      setError(context.args.name, { message: 'There was an error' });
    }
    if (context?.parameters.formValue) {
      setValue(context.args.name, context.parameters.formValue);
    }
  }, [context?.parameters.error]);

  return (
    <FormProvider {...methods}>
      <div className={GRID_CONTAINER}>
        <div className={HALF_WIDTH}>
          <Fieldset className={'gap-2 w-full'}>
            <Field className="flex flex-col gap-2">{children}</Field>
          </Fieldset>
        </div>
      </div>
    </FormProvider>
  );
};
