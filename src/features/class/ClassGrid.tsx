import { useMemo, useRef } from "react";
import {
  AllCommunityModule,
  type ColDef,
  colorSchemeLightCold,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { BASE_GRID_STYLE } from "../../constants/grid.ts";
import { ActingClassColumns } from "./constants.ts";
import classNames from "classnames/index.js";
import { UserContext } from "../../App.tsx";
import { useSelector } from "@xstate/react";
ModuleRegistry.registerModules([AllCommunityModule]);

const theme = themeQuartz
  .withPart(colorSchemeLightCold)
  .withParams(BASE_GRID_STYLE);

export const ClassesGrid = () => {
  const { actingClassRef } = useSelector(UserContext.useActorRef(), (state) => {
    return state.context;
  });
  const { data, loading } = useSelector(actingClassRef, (state) => {
    return state.context;
  });

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      cellStyle: { display: "flex", alignItems: "left" },
      filter: true,
      resizable: false,
      flex: 1,
    };
  }, []);

  const gridRef = useRef<AgGridReact>(null);

  return (
    <div className={classNames("w-full", "border-2")}>
      <div className="p-4 space-y-4 mx-auto w-96">
        <h1 className="text-2xl font-semibold">Classes</h1>
        <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden w-full">
          <AgGridReact
            theme={theme}
            rowData={data}
            loading={loading}
            columnDefs={ActingClassColumns}
            defaultColDef={defaultColDef}
            ref={gridRef}
          />
        </div>
      </div>
    </div>
  );
};
