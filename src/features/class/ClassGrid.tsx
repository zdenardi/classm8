import { ActingClassColumns } from "./constants.ts";
import classNames from "classnames/index.js";

import { BasicGrid } from "../../components/agGrid/Grid.tsx";
import { useClasses } from "../../hooks/contextHooks.ts";
import { RowClickedEvent } from "ag-grid-community";

interface Props {
  onRowClicked?: (event: RowClickedEvent) => void;
}

export const ClassesGrid = (props: Props) => {
  const { classes, loading } = useClasses();

  return (
    <>
      <div className={classNames("w-full", "border-2")}>
        <div className="p-4 space-y-4 mx-auto ">
          <h1 className="text-2xl font-semibold text-left">Classes</h1>
          <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
            <BasicGrid
              data={classes}
              loading={loading}
              colDefs={ActingClassColumns}
              pagination
              onRowClicked={props.onRowClicked}
            />
          </div>
        </div>
      </div>
    </>
  );
};
