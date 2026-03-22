import { useCustomForm } from "../../hooks/useCustomForm.ts";
import { FormProvider } from "react-hook-form";
import { Row, Section } from "../../components/forms/index.ts";
import { Field } from "../../components/catalyst/fieldset.tsx";
import { Label } from "../../components/catalyst/fieldset.tsx";
import { Input } from "../../components/catalyst/input.tsx";
import { sceneFormSchema, SceneFormValues } from "./schema.ts";

import { Controller } from "react-hook-form";
import {
  Combobox,
  ComboboxOption,
  ComboboxLabel,
} from "../../components/catalyst/combobox.tsx";
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
} from "../../components/catalyst/listbox.tsx";
import { OptionType } from "../../../types/common.ts";
import { Textarea } from "../../components/catalyst/textarea.tsx";
import { Button } from "../../components/catalyst/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { SceneTypes } from "../../../prisma/generated/enums.ts";

interface Props {
  rosterOptions: OptionType[];
  classOptions: OptionType[];
  sendValues: (values: SceneFormValues) => void;
  handleError: () => void;
}

export const SceneForm = (props: Props) => {
  const {
    rosterOptions,
    sendValues,
    handleError,
    classOptions: dateOptions,
  } = props;
  const [performers, setPerformers] = useState<OptionType[]>([]);
  const filteredRosterOptions = useMemo(
    () =>
      rosterOptions.filter(
        (option) => !performers.some((p) => p.value === option.value),
      ),
    [rosterOptions, performers],
  );

  const sceneTypeOptions: OptionType[] = Object.values(SceneTypes).map(
    (type) => ({
      value: type,
      label: type.charAt(0) + type.slice(1).toLowerCase(),
    }),
  );

  const methods = useCustomForm<SceneFormValues>({
    resolver: zodResolver(sceneFormSchema),
  });

  const { handleSubmit, control, setValue } = methods;

  const onSubmit = (data: SceneFormValues) => {
    sendValues(data);
  };

  const onSubmitError = (err: any) => {
    console.log("SUBMIT ERROR TRIGGERED: ", err);
    handleError();
  };

  const removePerson = (p: OptionType) => {
    const updated = performers.filter((person) => person.value !== p.value);
    setPerformers(updated);
    setValue(
      "performerIDs",
      updated.map((person) => Number(person.value)),
    );
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, onSubmitError)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col pb-10 gap-5 items-left w-4/5 mx-auto">
            <Section componentsPerLine={2}>
              <Row>
                <Field className="text-start">
                  <Label>Title</Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input className="w-full" {...field} />
                    )}
                  />
                </Field>
              </Row>
              <Row>
                <Field className="text-start">
                  <Label className="text-start">Duration (In Minutes)</Label>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <Input
                        className="w-8"
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </Field>
              </Row>
            </Section>
            <Section componentsPerLine={2}>
              <Row>
                <Field className="text-start">
                  <Label>Class</Label>
                  <Controller
                    name="classID"
                    control={control}
                    render={({ field }) => (
                      <Combobox<OptionType>
                        onChange={(value) => {
                          if (value) {
                            field.onChange(value.value);
                          }
                        }}
                        options={dateOptions}
                        displayValue={(option) => option?.label || ""}
                        placeholder="Select Class"
                      >
                        {(option: OptionType) => (
                          <ComboboxOption value={option}>
                            <ComboboxLabel>{option.label}</ComboboxLabel>
                          </ComboboxOption>
                        )}
                      </Combobox>
                    )}
                  />
                </Field>
              </Row>
              <Row>
                <Field className="text-start">
                  <Label>Type</Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Listbox<OptionType>
                        onChange={(value) => {
                          if (value) {
                            field.onChange(value.value);
                          }
                        }}
                        placeholder="Select Scene Type"
                      >
                        {sceneTypeOptions.map((option) => (
                          <ListboxOption key={option.value} value={option}>
                            <ListboxLabel>{option.label}</ListboxLabel>
                          </ListboxOption>
                        ))}
                      </Listbox>
                    )}
                  />
                </Field>
              </Row>
            </Section>
            <Section componentsPerLine={1}>
              <Row>
                <Field className="text-start">
                  <Label>Performers</Label>
                  <Controller
                    name="performerIDs"
                    control={control}
                    render={({ field }) => (
                      <Combobox<OptionType | null>
                        value={null}
                        onChange={(value) => {
                          if (value) {
                            setPerformers([...performers, value]);
                            field.onChange(
                              [...performers, value].map((p) =>
                                Number(p.value),
                              ),
                            );
                          }
                        }}
                        options={filteredRosterOptions}
                        displayValue={(option) => option?.label || ""}
                        placeholder="Select Scene Partners"
                      >
                        {(option: OptionType) => (
                          <ComboboxOption value={option}>
                            <ComboboxLabel>{option.label}</ComboboxLabel>
                          </ComboboxOption>
                        )}
                      </Combobox>
                    )}
                  />
                </Field>
                <div className="text-start">
                  <ul className="list-disc list-inside">
                    <li>[You]</li>
                    {performers.map((p) => (
                      <li key={p.value} className="flex items-center">
                        {p.label}
                        <button type="button" onClick={() => removePerson(p)}>
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <Field>
                  <Label>Notes</Label>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => <Textarea {...field} rows={4} />}
                  />
                </Field>
              </Row>
            </Section>
            <Button type="submit" className="w-fit" color="indigo">
              Save Scene
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
