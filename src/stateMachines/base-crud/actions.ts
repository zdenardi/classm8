import { DoneActorEvent } from 'xstate';
import { DeleteEvent, EditEvent, SendSharedContextEvent, SortEvent } from './events';
import { BaseFormContext, BaseFormScope, DataItem } from './types';

export const toggleLoading = <TContext extends BaseFormContext>({
  context,
}: {
  context: TContext;
}) => {
  return {
    loading: !context.loading,
  };
};

export const resetLoading = {
  loading: false,
};

export const openModal = {
  modal: () => ({
    create: true,
    edit: false,
  }),
};

export const closeModal = {
  modal: () => ({
    create: false,
    edit: false,
  }),
};

export const setContext = <TContext extends BaseFormContext>(
  machineScope: BaseFormScope<TContext>
) => {
  const event = machineScope.event as SendSharedContextEvent<TContext>;
  return {
    ...event.values,
  };
};

export const setDataToDelete = <TContext extends BaseFormContext>(
  machineScope: BaseFormScope<TContext, DeleteEvent | EditEvent | unknown>
): Partial<TContext> => {
  const event = machineScope.event as DeleteEvent;
  const id = event.payload.id;
  return {
    idToDelete: id,
  } as Partial<TContext>;
};

export const setDataToEdit = <TContext extends BaseFormContext>({
  context,
  event,
}: BaseFormScope<TContext, EditEvent | DeleteEvent | unknown>): Partial<TContext> => {
  const editEvent = event as EditEvent;
  const dataToEdit = (context.data as TContext['form'][]).find(
    (singleData: TContext['form']) => (singleData as DataItem).id == editEvent.payload.id
  );
  return {
    form: dataToEdit || ({} as TContext['form']),
    modal: {
      edit: true,
      create: false,
    },
  } as Partial<TContext>;
};

export const setDataSort = <TContext extends BaseFormContext>({
  context,
  event,
}: BaseFormScope<TContext, SortEvent<string> | unknown>) => {
  const _event = event as SortEvent<string>;
  return {
    sort: {
      ...(context.sort as TContext['sort']),
      sortBy: _event.sortBy,
      [_event.sortBy]: -1 * (context.sort[_event.sortBy] as number),
    },
  };
};

export const setCreateSuccess = <TContext extends BaseFormContext>({
  context,
  event,
}: BaseFormScope<TContext>) => {
  return {
    data: [
      ...context.data,
      (event as DoneActorEvent<TContext['form'], string>).output,
    ] as TContext['data'],
  };
};

export const setGetSuccess = <TContext extends BaseFormContext>({
  event,
}: BaseFormScope<TContext>) => {
  return {
    data: (event as DoneActorEvent<TContext['data'], string>).output as TContext['data'],
  };
};

export const setPatchSuccess = <TContext extends BaseFormContext>({
  context,
  event,
}: BaseFormScope<TContext>) => {
  const { output: updatedData } = event as DoneActorEvent<TContext['form'], string>;
  const untouchedData = (context.data as DataItem[]).filter(
    (deletePayload: DataItem) => deletePayload.id !== (updatedData as DataItem).id
  );
  untouchedData.push(updatedData);
  return {
    data: untouchedData as TContext['data'],
  };
};

export const resetState = <TContext extends BaseFormContext>(initialForm: TContext['form']) => {
  return {
    loading: false,
    modal: { create: false, edit: false },
    form: initialForm,
  };
};

export const deleteData = <TContext extends BaseFormContext>({
  context,
}: BaseFormScope<TContext>) => {
  return {
    data: (context.data as DataItem[]).filter((deletePayload: DataItem) => {
      return deletePayload.id !== context.idToDelete;
    }) as TContext['data'],
  };
};
