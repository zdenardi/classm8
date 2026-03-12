import { FormProvider } from "react-hook-form";
import { Row, Section } from "../../components/forms/index.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "../../components/catalyst/fieldset.tsx";
import { Label } from "../../components/catalyst/fieldset.tsx";
import { Input } from "../../components/catalyst/input.tsx";
import { courseFormSchema, CourseFormValues } from "./schema.ts";
import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useCustomForm } from "../../hooks/useCustomForm.ts";
import { OptionType } from "../../../types/common.ts";
import {
  Combobox,
  ComboboxLabel,
  ComboboxOption,
} from "../../components/catalyst/combobox.tsx";

interface Props {
  sendValues: (values: CourseFormValues) => void;
  handleError: () => void;
  instructors: OptionType[];
}

export const CourseForm = (props: Props) => {
  const { sendValues, handleError, instructors } = props;

  const methods = useCustomForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
  });

  const { handleSubmit, control } = methods;

  const startDate = useWatch({ control, name: "startDate" });
  const numOfRepeat = useWatch({ control, name: "repeatNum" });

  const dayOfWeek = useMemo(() => {
    if (!startDate) return "";
    const [year, month, day] = startDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }, [startDate]);

  const calculatedEndDate = useMemo(() => {
    if (!startDate || !numOfRepeat || numOfRepeat <= 0) return null;
    const [year, month, day] = startDate.split("-").map(Number);
    const endDate = new Date(year, month - 1, day);
    // Add (numOfRepeat - 1) weeks to get the last class date
    endDate.setDate(endDate.getDate() + (numOfRepeat - 1) * 7);
    return endDate;
  }, [startDate, numOfRepeat]);

  const onSubmit = (data: CourseFormValues) => {
    sendValues(data);
  };

  const onSubmitError = () => {
    console.log("SUBMIT ERROR TRIGGERED");
    handleError();
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
                  <Label>Instructor</Label>
                  <Controller
                    name="instructorId"
                    control={control}
                    render={({ field }) => (
                      <Combobox<OptionType | null>
                        onChange={(value) => {
                          if (value) {
                            field.onChange(Number(value.value));
                          }
                        }}
                        options={instructors}
                        displayValue={(option) => option?.label || ""}
                        placeholder="Select Instructor"
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
                <Label>Title</Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </Row>
              <Row>
                <Label>Location</Label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
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
              </Row>
              <Row>
                <Field>
                  <Label>Start Time</Label>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => <Input {...field} type="time" />}
                  />
                </Field>
              </Row>
              <Row>
                <Field>
                  <Label>End Time</Label>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => <Input {...field} type="time" />}
                  />
                </Field>
              </Row>
              <Row>
                <Field>
                  <Label>How many weeks does it repeat?</Label>
                  <Controller
                    name="repeatNum"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    )}
                  />
                </Field>
              </Row>
              <Row>
                <Field>
                  <Label>Student Limit (Optional)</Label>
                  <Controller
                    name="studentLimit"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                      />
                    )}
                  />
                </Field>
              </Row>
            </Section>
            {calculatedEndDate && (
              <div className="text-center p-4  rounded">
                <p className="text-lg font-semibold">
                  Course runs from {new Date(startDate).toLocaleDateString()} to{" "}
                  {calculatedEndDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  ({numOfRepeat} week{numOfRepeat !== 1 ? "s" : ""})
                </p>
              </div>
            )}
            <Section componentsPerLine={1}>
              <Row>
                <p>Classes</p>
                <div className="text-start grid grid-cols-2">
                  {numOfRepeat &&
                    Array.from({ length: numOfRepeat }, (_, index) => {
                      let weekDate = null;
                      if (startDate) {
                        const [year, month, day] = startDate
                          .split("-")
                          .map(Number);
                        weekDate = new Date(year, month - 1, day);
                        weekDate.setDate(weekDate.getDate() + index * 7);
                      }

                      return (
                        <Field key={index}>
                          <Label>
                            Week {index + 1}: {dayOfWeek}
                            {weekDate && ` - ${weekDate.toLocaleDateString()}`}
                          </Label>
                        </Field>
                      );
                    })}
                </div>
              </Row>
            </Section>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Course with Classes
          </button>
        </form>
      </FormProvider>
    </>
  );
};
