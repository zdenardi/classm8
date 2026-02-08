import { useCustomForm } from "../../hooks/useCustomForm.ts";
import { FormProvider } from "react-hook-form";
import { Row, Section } from "../../components/forms/index.ts";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { OptionType } from "../../../types/common.ts";
import { Textarea } from "../../components/catalyst/textarea.tsx";

interface Props {
  rosterOptions: OptionType[];
  sendValues: (values: SceneFormValues) => void;
  handleError: () => void;
}

export const CourseForm = (props: Props) => {
  const { rosterOptions, sendValues, handleError } = props;

  const methods = useCustomForm<SceneFormValues>({
    resolver: zodResolver(sceneFormSchema),
  });

  const { handleSubmit, control } = methods;

  const onSubmit = (data: SceneFormValues) => {
    sendValues(data);
    console.log(data);
  };

  const onSubmitError = (err: any) => {
    console.log("SUBMIT ERROR TRIGGERED: ", err);
    handleError();
  };

  const options = [
    {
      label: "Belcher, Bob",
      value: "1",
    },
    {
      label: "Belcher, Linda",
      value: "2",
    },
    {
      label: "Belcher, Tina",
      value: "3",
    },
    {
      label: "Belcher, Gene",
      value: "4",
    },
    {
      label: "Belcher, Louise",
      value: "5",
    },
  ];

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, onSubmitError)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col pb-10 gap-5 items-left w-4/5 mx-auto">
            <Section componentsPerLine={1}>
              <Row>
                <Field>
                  <Label>Title</Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </Field>
                <Field>
                  <Label>Performers</Label>
                  <Combobox
                    onChange={(value) => console.log(value)}
                    options={options}
                    displayValue={(option: OptionType | null) =>
                      option?.label || ""
                    }
                    placeholder="Select Scene Partners"
                  >
                    {(option: OptionType) => (
                      <ComboboxOption value={option}>
                        <ComboboxLabel>{option.label}</ComboboxLabel>
                      </ComboboxOption>
                    )}
                  </Combobox>
                </Field>
                <div>Performers go here</div>
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
          </div>
        </form>
      </FormProvider>
    </>
  );
};
