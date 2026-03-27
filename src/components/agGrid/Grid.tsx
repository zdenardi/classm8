import type {
  ColDef,
  GridReadyEvent,
  RowClickedEvent,
  RowDragEndEvent,
  RowSelectionOptions,
} from "ag-grid-community";
import {
  AllCommunityModule,
  colorSchemeLightCold,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { type RefObject, useMemo, useRef } from "react";
import { GRID_HEIGHT } from "./constants.tsx";
import { BASE_GRID_STYLE } from "../../constants/grid.ts";

ModuleRegistry.registerModules([AllCommunityModule]);
const theme = themeQuartz
  .withPart(colorSchemeLightCold)
  .withParams(BASE_GRID_STYLE);

export interface GridProps {
  data: any[];
  loading: boolean;
  colDefs: ColDef<any, any>[];
  pagination: boolean;
  rowSelection?: RowSelectionOptions;
  paginationPageSize?: number;
  paginationPageSizeSelector?: number[];
  enableFilterHandlers?: boolean;
  rowDragManaged?: boolean;
  onRowDragEnd?: (event: RowDragEndEvent) => void;
  onRowClicked?: (event: RowClickedEvent) => void;
  onGridReady?: (event: GridReadyEvent) => void;
  gridRef?: RefObject<AgGridReact | null>;
}

export const BasicGrid = ({
  data,
  loading,
  colDefs,
  pagination,
  rowSelection,
  paginationPageSize = 10,
  paginationPageSizeSelector = [10, 20, 50],
  enableFilterHandlers = true,
  rowDragManaged = false,
  onRowDragEnd,
  onRowClicked,
  onGridReady,
  gridRef: externalRef,
}: GridProps) => {
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      cellStyle: {
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "4px",
        paddingBottom: "4px",
        lineHeight: "1.5",
      },
      filter: true,
      resizable: false,
      flex: 1,
      autoHeight: true,
      wrapText: true,
      minWidth: 120,
    };
  }, []);

  const internalRef = useRef<AgGridReact>(null);
  const gridRef = externalRef ?? internalRef;

  return (
    <div className="h-full w-full p-0">
      <AgGridReact
        theme={theme}
        enableFilterHandlers={enableFilterHandlers}
        rowData={data}
        loading={loading}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowSelection={rowSelection}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        loadingOverlayComponent={() => <p>Loading...</p>}
        ref={gridRef}
        domLayout="autoHeight"
        rowDragManaged={rowDragManaged}
        onRowDragEnd={onRowDragEnd}
        onRowClicked={onRowClicked}
        onGridReady={onGridReady}
      />
    </div>
  );
};
