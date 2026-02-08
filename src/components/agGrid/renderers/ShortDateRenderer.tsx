import { CustomCellRendererProps } from 'ag-grid-react';

export const ShortDateRenderer = (field: string) => (props: CustomCellRendererProps) => {
  return new Date(props.data[field]).toLocaleDateString('en-US', {
    month: '2-digit',
    year: '2-digit',
    timeZone: 'UTC',
  });
};
