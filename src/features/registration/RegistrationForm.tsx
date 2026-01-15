import { FormProvider } from "react-hook-form";
import { Row, Section } from "../../components/forms/index.ts";
import { TextInput } from "../../components/forms/TextInput/TextInput.tsx";
import { useCustomForm } from "../../hooks/useCustomForm.ts";
import { registrationFormSchema, RegistrationFormValues } from "./schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserContext } from "../../App.tsx";
import { useSelector } from "@xstate/react";

export const RegistrationForm = () => {
  const userRef = UserContext.useActorRef();
  const { loading, profile } = useSelector(userRef, (state) => {
    return state.context;
  });
  const methods = useCustomForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      email: profile?.email,
    },
  });
  const { handleSubmit } = methods;
  return (
    <FormProvider {...methods}>
      <form>
        <div className="flex flex-col pb-10 gap-5 items-left w-4/5 mx-auto bg-white">
          <Section componentsPerLine={1}>
            <Row>
              <TextInput label="First Name" name="firstName" />
            </Row>
            <Row>
              <TextInput label="Last Name" name="lastName" />
            </Row>
            <Row>
              <TextInput label="Emails" name="email" />
            </Row>
          </Section>
        </div>
      </form>
    </FormProvider>
  );
};
