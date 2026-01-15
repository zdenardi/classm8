import { useSelector } from "@xstate/react";
import { UserContext } from "../../App.tsx";
import { FormDialog } from "../../components/dialogs/FormDialog.tsx";
import { RegistrationForm } from "./RegistrationForm.tsx";

export const RegistrationModal = () => {
  const { registrationRef } = useSelector(
    UserContext.useActorRef(),
    (state) => {
      return state.context;
    }
  );
  const { openModal } = useSelector(registrationRef, (state) => {
    return state.context;
  });

  const handleClose = () => {
    registrationRef.send({ type: "ON_CLOSE" });
  };
  return (
    <FormDialog creating={openModal} onClose={handleClose}>
      <RegistrationForm />
    </FormDialog>
  );
};
