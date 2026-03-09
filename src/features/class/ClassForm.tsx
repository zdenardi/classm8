import { useSelector } from "@xstate/react";
import { UserContext } from "../../App.tsx";
import { useCustomForm } from "../../hooks/useCustomForm.ts";
import { classFormSchema, ClassFormValues } from "./schema.ts";
import { FormProvider } from "react-hook-form";
import { Row, Section, TextInput } from "../../components/forms/index.ts";
import { Field } from "../../components/catalyst/fieldset.tsx";
import { Label } from "../../components/catalyst/fieldset.tsx";
import { Input } from "../../components/catalyst/input.tsx";
import { zodResolver } from "@hookform/resolvers/zod";

export const ClassForm = () => {
  const userRef = UserContext.useActorRef();

  const methods = useCustomForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      location: "",
      notes: "",
      streamingLink: "",
      startDate: "",
      endDate: "",
      instructor: -1,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: ClassFormValues) => {
    console.log(data);
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
          <Section componentsPerLine={1}>
            <Row>
              <TextInput label="Location" name="location" />
            </Row>
            <Row>
              <Field>
                <Label> Start Date</Label>
                <Input
                  type="datetime-local"
                  defaultValue={new Date()
                    .toLocaleString("sv-SE")
                    .replace(" ", "T")
                    .slice(0, 16)}
                  min={new Date()
                    .toLocaleString("sv-SE")
                    .replace(" ", "T")
                    .slice(0, 16)}
                  step="300"
                />
              </Field>
            </Row>
          </Section>
        </div>
      </form>
    </FormProvider>
  );
};
