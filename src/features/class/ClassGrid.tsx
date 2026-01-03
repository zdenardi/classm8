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
      <div className="bg-blue-500 text-white p-4 rounded-lg">
        Tailwind is working! 🎉
      </div>
    </div>
  );
};
