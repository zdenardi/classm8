import {
  FilterWrapperParams,
  IAfterGuiAttachedParams,
} from "ag-grid-community";
import {
  useGridFilterDisplay,
  type CustomFilterDisplayProps,
} from "ag-grid-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const CustomDateRangeFilter = ({
  onModelChange,
}: CustomFilterDisplayProps & FilterWrapperParams) => {
  const refInput = useRef<HTMLInputElement>(null);
  const afterGuiAttached = useCallback((params?: IAfterGuiAttachedParams) => {
    if (!params || !params.suppressFocus) {
      refInput.current?.focus();
    }
  }, []);

  useGridFilterDisplay({
    afterGuiAttached,
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    onModelChange({ startDate: startDate || null, endDate: endDate || null });
  }, [startDate, endDate, onModelChange]);

  return (
    <div className="p-2 w-48 flex flex-col gap-2">
      <div>
        <label className="text-xs text-gray-600 block mb-1">From:</label>
        <input
          ref={refInput}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-1 border rounded text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-gray-600 block mb-1">To:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-1 border rounded text-sm"
        />
      </div>

      <button
        onClick={clearDates}
        className="text-xs text-primary-500 hover:underline mt-2"
        type="button"
      >
        Clear
      </button>
    </div>
  );
};
