import { useSelector } from "@xstate/react";
import { UserContext } from "../../App.tsx";
import { useCustomForm } from "../../hooks/useCustomForm.ts";
import { registrationFormSchema, RegistrationFormValues } from "./schema.ts";
import { FormProvider } from "react-hook-form";
import { Row, Section, TextInput } from "../../components/forms/index.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActorRefFrom } from "xstate";
import type { registrationMachine } from "./registration.machine.ts";
import { useUser } from "@clerk/clerk-react";

export const RegistrationForm = () => {
  const userRef = UserContext.useActorRef();
  const snapshot = userRef.getSnapshot();
  const { user } = useUser();

  const registrationRef = snapshot.children.registrationMachine as
    | ActorRefFrom<typeof registrationMachine>
    | undefined;

  const { profile } = useSelector(userRef, (state) => state.context);

  const loading = registrationRef
    ? useSelector(registrationRef, (state) => state.context.loading)
    : false;

  const methods = useCustomForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: profile?.firstName || user?.firstName || "",
      lastName: profile?.lastName || user?.lastName || "",
      email: profile?.email || user?.primaryEmailAddress?.emailAddress || "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: RegistrationFormValues) => {
    try {
      console.group("Submit ");
      console.log(data);
      console.groupEnd();

      if (registrationRef) {
        registrationRef.send({
          type: "SUBMIT",
          payload: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
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
              <TextInput label="First Name" name="firstName" />
            </Row>
            <Row>
              <TextInput label="Last Name" name="lastName" />
            </Row>
            <Row>
              <TextInput label="Email" name="email" />
            </Row>
          </Section>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </FormProvider>
  );
};
