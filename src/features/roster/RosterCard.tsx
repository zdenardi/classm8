import { BasicGrid } from "../../components/agGrid/Grid.tsx";
import { Card } from "../../components/Card.tsx";
import { useRoster } from "../../hooks/contextHooks.ts";
import { UsersColumns } from "../user/constants.ts";

export const RosterCard = () => {
  const { loading: rosterLoading, roster } = useRoster();
  return (
    <Card className="col-span-4">
      <div className="border-l-4 border-blue-500 pl-4 mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white ">
          Roster
        </h3>
      </div>
      <div>
        <BasicGrid
          data={roster}
          loading={rosterLoading}
          colDefs={UsersColumns}
          pagination={false}
        />
      </div>
    </Card>
  );
};
