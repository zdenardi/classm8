import { UserContext } from "../../App.tsx";
import { useCustomForm } from "../../hooks/useCustomForm.ts";
import { FormProvider } from "react-hook-form";
import { Row, Section, TextInput } from "../../components/forms/index.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "../../components/catalyst/fieldset.tsx";
import { Label } from "../../components/catalyst/fieldset.tsx";
import { Input } from "../../components/catalyst/input.tsx";
import { courseFormSchema, CourseFormValues } from "./schema.ts";
import { AgGridReact } from "ag-grid-react";
import { ActingClassColumns } from "../class/constants.ts";
import {
  type ColDef,
  colorSchemeLightCold,
  themeQuartz,
} from "ag-grid-community";
import { BASE_GRID_STYLE } from "../../constants/grid.ts";
import { useMemo, useRef, useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import {
  Combobox,
  ComboboxOption,
  ComboboxLabel,
} from "../../components/catalyst/combobox.tsx";
import { OptionType } from "../../../types/common.ts";

interface Props {
  instructorOptions: OptionType[];
  sendValues: (values: CourseFormValues) => void;
  handleError: () => void;
}

export const CourseForm = (props: Props) => {
  const { instructorOptions, sendValues, handleError } = props;

  const theme = themeQuartz
    .withPart(colorSchemeLightCold)
    .withParams(BASE_GRID_STYLE);

  const gridRef = useRef<AgGridReact>(null);

  const methods = useCustomForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
  });

  const { handleSubmit, control } = methods;

  const startDate = useWatch({ control, name: "startDate" });

  const dayOfWeek = useMemo(() => {
    if (!startDate) return "";
    const date = new Date(startDate);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }, [startDate]);

  const onSubmit = (data: CourseFormValues) => {
    sendValues(data);
    console.log(data);
  };

  const onSubmitError = (err: any) => {
    console.log("SUBMIT ERROR TRIGGERED: ", err);
    handleError();
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      cellStyle: { display: "flex", alignItems: "left" },
      filter: true,
      resizable: false,
      flex: 1,
    };
  }, []);

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
                <TextInput label="Location" name="location" />
              </Row>
              <Row>
                <Field>
                  <Label>Start Date</Label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => <Input {...field} type="date" />}
                  />
                </Field>
                <Field>
                  <Label>How many weeks does it repeat?</Label>

                  <Input type="number" />
                </Field>

                <Field>
                  <Label>{dayOfWeek}</Label>
                </Field>
                <Field>
                  <Label>Instructor</Label>
                  <Controller
                    name="instructorId"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        value={
                          instructorOptions.find(
                            (opt) => opt.value === field.value?.toString(),
                          ) || undefined
                        }
                        onChange={(value) =>
                          field.onChange(
                            value ? parseInt(value.value) : undefined,
                          )
                        }
                        options={instructorOptions}
                        displayValue={(option: OptionType | null) =>
                          option?.label || ""
                        }
                        placeholder="Select an instructor"
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
            </Section>
          </div>
        </form>
      </FormProvider>
      <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden w-full">
        <AgGridReact
          theme={theme}
          rowData={[]}
          loading={false}
          columnDefs={ActingClassColumns}
          defaultColDef={defaultColDef}
          ref={gridRef}
        />
      </div>
    </>
  );
};
