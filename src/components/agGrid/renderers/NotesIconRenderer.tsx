import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CustomCellRendererProps } from 'ag-grid-react';

export const NotesIconRenderer = (params: CustomCellRendererProps) => {
  return (
    params.data.privilegeNotes && (
      <div className="pt-2">
        <DocumentTextIcon aria-hidden="true" className={'text-secondary size-5 shrink-0'} />
      </div>
    )
  );
};
