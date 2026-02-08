import { FilterWrapperParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { useGridFilterDisplay, type CustomFilterDisplayProps } from 'ag-grid-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type ExpirationStatus = 'all' | 'expired' | 'expiring-soon';

export const CustomExpirationStatusFilter = ({
  onModelChange,
}: CustomFilterDisplayProps & FilterWrapperParams) => {
  const refInput = useRef<HTMLSelectElement>(null);
  const afterGuiAttached = useCallback((params?: IAfterGuiAttachedParams) => {
    if (!params || !params.suppressFocus) {
      refInput.current?.focus();
    }
  }, []);

  useGridFilterDisplay({
    afterGuiAttached,
  });

  const [selectedStatus, setSelectedStatus] = useState<ExpirationStatus>('all');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as ExpirationStatus);
  };

  useEffect(() => {
    onModelChange(selectedStatus);
  }, [selectedStatus, onModelChange]);

  return (
    <div className="p-2 w-48 flex flex-col gap-2">
      <label className="text-xs text-gray-600 block mb-1">Filter by:</label>
      <select
        ref={refInput}
        value={selectedStatus}
        onChange={handleChange}
        className="w-full p-2 border rounded text-sm"
      >
        <option value="all">All</option>
        <option value="expired">Expired</option>
        <option value="expiring-soon">Expiring Soon (90 days)</option>
      </select>
    </div>
  );
};
