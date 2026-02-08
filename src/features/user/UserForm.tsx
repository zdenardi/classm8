import { useCustomForm } from "../../hooks/useCustomForm.ts";
import { userFormSchema, UserFormValues } from "./schema.ts";
import { Controller, FormProvider } from "react-hook-form";
import { Row, Section } from "../../components/forms/index.ts";
import { Field } from "../../components/catalyst/fieldset.tsx";
import { Label } from "../../components/catalyst/fieldset.tsx";
import { Input } from "../../components/catalyst/input.tsx";
import { USER_TYPES } from "./constants.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "../../components/catalyst/select.tsx";

interface Props {
  formValues: Partial<UserFormValues>;
  sendValues: (values: UserFormValues) => void;
  handleError: () => void;
}

export const UserForm = (props: Props) => {
  const { sendValues, formValues } = props;
  const methods = useCustomForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: formValues,
  });

  const { handleSubmit, control } = methods;

  const onSubmit = (data: UserFormValues) => {
    sendValues(data);
  };

  const onSubmitError = (err: unknown) =>
    console.log("SUBMIT ERROR TRIGGERED: ", err);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, onSubmitError)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col pb-10 gap-5 items-left w-4/5 mx-auto">
          <Section componentsPerLine={2}>
            <Row>
              <Field>
                <Label> First Name</Label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </Field>
            </Row>
            <Row>
              <Field>
                <Label> Last Name</Label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </Field>
            </Row>
            <Row>
              <Field>
                <Label> Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <Input {...field} type="email" />}
                />
              </Field>
            </Row>
            <Row>
              <Field>
                <Label> User Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      {USER_TYPES.map((type, idx) => (
                        <option key={idx} value={type}>
                          {type.toLocaleUpperCase()}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </Field>
            </Row>
          </Section>
        </div>
      </form>
    </FormProvider>
  );
};
