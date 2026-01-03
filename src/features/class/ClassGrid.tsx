import { useEffect, useMemo, useRef, useState } from "react";
import {
  AllCommunityModule,
  ColDef,
  colorSchemeLightCold,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { CLASS_API_CALLS } from "../../utils/routes.ts";
import { AgGridReact } from "ag-grid-react";
import { BASE_GRID_STYLE, GRID_CONTAINER } from "../../constants/grid.ts";
import { ActingClassColumns } from "./constants.ts";
import { ClassWithCourseAndScenes } from "../../types/class.ts";
import classNames from "classnames/index.js";

ModuleRegistry.registerModules([AllCommunityModule]);
const theme = themeQuartz
  .withPart(colorSchemeLightCold)
  .withParams(BASE_GRID_STYLE);

export const ClassesGrid = () => {
  const [classes, setClasses] = useState<ClassWithCourseAndScenes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await CLASS_API_CALLS.get();
        console.log(data);
        setClasses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);
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
            rowData={classes}
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
