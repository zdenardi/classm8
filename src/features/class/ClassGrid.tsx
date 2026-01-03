import { useEffect } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { CLASS_API_CALLS } from "../../utils/routes.ts";

ModuleRegistry.registerModules([AllCommunityModule]);

export const ClassesGrid = () => {
  useEffect(() => {
    CLASS_API_CALLS.get();
  }, []);

  return (
    <div>
      <p>Gonna go here</p>
    </div>
  );
};
