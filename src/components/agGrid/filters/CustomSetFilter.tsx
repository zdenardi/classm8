import {
  FilterWrapperParams,
  IAfterGuiAttachedParams,
} from "ag-grid-community";
import {
  useGridFilterDisplay,
  type CustomFilterDisplayProps,
} from "ag-grid-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const CustomSetFilter = ({
  onModelChange,
  api,
  getValue,
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

  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const values = new Set<string>();
    api.forEachNode((node) => {
      const value = getValue(node);
      if (value != null) values.add(String(value));
    });
    setAvailableOptions(Array.from(values).sort());
  }, [api, getValue]);

  const filteredOptions = availableOptions.filter((value) =>
    value.toLowerCase().includes(searchText.toLowerCase()),
  );

  const onCheckboxChange = (value: string) => {
    const newSelected = new Set(selectedValues);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    setSelectedValues(newSelected);
  };

  const selectAll = () => {
    setSelectedValues(new Set(availableOptions));
  };

  const clearAll = () => {
    setSelectedValues(new Set());
  };

  useEffect(() => {
    onModelChange(Array.from(selectedValues));
  }, [selectedValues, onModelChange]);

  return (
    <div className="p-2 w-48 overflow-hidden flex flex-col max-h-64">
      <input
        ref={refInput}
        type="text"
        placeholder={"Search..."}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-2 p-1 border rounded text-sm"
      />

      <div className="flex gap-2 mb-2">
        <button
          onClick={selectAll}
          className="text-xs text-primary-500 hover:underline"
        >
          Select All
        </button>
        <button
          onClick={clearAll}
          className="text-xs text-primary-500 hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="text-xs text-gray-500 p-2">No items found</div>
        ) : (
          filteredOptions.map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 p-1 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedValues.has(value)}
                onChange={() => onCheckboxChange(value)}
                className="text-sm"
              />
              <span className="text-sm truncate" title={value}>
                {value}
              </span>
            </label>
          ))
        )}
      </div>

      {selectedValues.size > 0 && (
        <div className="text-xs text-gray-600 mt-2 pt-2 border-t">
          {selectedValues.size} of {availableOptions.length} selected
        </div>
      )}
    </div>
  );
};
