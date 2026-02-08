import type { ColDef, RowSelectionOptions } from "ag-grid-community";
import {
  AllCommunityModule,
  colorSchemeLightCold,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
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
  cyTag: string;
  rowSelection?: RowSelectionOptions;
  paginationPageSize?: number;
  paginationPageSizeSelector?: number[];
  enableFilterHandlers?: boolean;
}

export const BasicGrid = ({
  data,
  loading,
  colDefs,
  pagination,
  rowSelection,
  paginationPageSize = 10,
  paginationPageSizeSelector = [10, 20, 50],
  cyTag,
  enableFilterHandlers = true,
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
    };
  }, []);

  const gridRef = useRef<AgGridReact>(null);

  return (
    <div className="h-full w-full p-0" data-cy={cyTag}>
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
      />
    </div>
  );
};
