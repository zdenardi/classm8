import { useCustomForm } from "../../hooks/useCustomForm.ts";
import { registrationFormSchema, RegistrationFormValues } from "./schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";

export const RegistrationForm = () => {
  const methods = useCustomForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  const { handleSubmit } = methods;
  return <FormProvider></FormProvider>;
};
