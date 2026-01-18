/* eslint-disable */
import { useSelector } from '@xstate/react';
import { ReactNode, useEffect, useState } from 'react';
import { useChannel } from 'storybook/preview-api';
import { UserContext } from '../app';
import { AccountRefContext } from '../features/provider/account/provider';
import Alert from '../features/provider/notifications/Alert';

const MachineHelperComponent = ({
  children,
  setMachineContext,
  machines,
}: {
  children: ReactNode;
  setMachineContext: (context: any) => void;
  machines?: string[];
}) => {
  const userRef = UserContext.useActorRef();
  const { accountRef } = useSelector(userRef, (state) => state.context);
  useEffect(() => {
    const machinesToWatch: any[] = [];
    machines?.forEach((machine) => {
      //@ts-expect-error type is dynamic
      machinesToWatch.push(accountRef.getSnapshot().context[machine]);
    });
    machinesToWatch.forEach((machine) => {
      machine.subscribe((snapshot: any) => {
        setMachineContext({
          [machine.id]: {
            state: snapshot.value,
            context: snapshot.context,
          },
        });
      });
    });

    const handleMachineEvent = (e: any) => {
      const event: { machineName: string; eventType: string; payload: any } = e.detail;
      //@ts-expect-error
      const machine = accountRef.getSnapshot().context[event.machineName];
      machine.send({
        type: event.eventType,
        payload: event.payload ? JSON.parse(JSON.stringify(event.payload)) : undefined,
      });
    };
    window.addEventListener('sendMachineEvent', handleMachineEvent);
    return () => {
      removeEventListener('sendMachineEvent', handleMachineEvent);
    };
  }, []);
  return children;
};

const AccountWrapper = ({
  children,
  setMachineContext,
  machines,
}: {
  children: ReactNode;
  setMachineContext: (context: any) => void;
  machines?: string[];
}) => {
  const userRef = UserContext.useActorRef();
  const { accountRef } = useSelector(userRef, (state) => state.context);

  return (
    <AccountRefContext.Provider value={accountRef}>
      <Alert />
      <MachineHelperComponent
        children={children}
        setMachineContext={setMachineContext}
        machines={machines}
      />
    </AccountRefContext.Provider>
  );
};

export const LoggedInUserWrapper = (Story: any, machines?: string[]) => {
  const [machineContext, setMachineContext] = useState<any>({});
  const channel = useChannel({
    'send-machine-event': (e) => {
      window.dispatchEvent(new CustomEvent('sendMachineEvent', { detail: e }));
    },
  });

  useEffect(() => {
    channel('machine-context-changed', machineContext);
  }, [machineContext]);

  return (
    <UserContext.Provider>
      <AccountWrapper setMachineContext={setMachineContext} machines={machines}>
        <Story />
      </AccountWrapper>
    </UserContext.Provider>
  );
};
