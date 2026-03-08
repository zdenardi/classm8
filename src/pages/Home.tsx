import { Card } from "../components/Card.tsx";
import { Badge } from "../components/catalyst/badge.tsx";
import { BasicGrid } from "../components/agGrid/Grid.tsx";
import { UsersColumns } from "../features/user/constants.ts";

import { useRoster } from "../hooks/contextHooks.ts";
export const Home = () => {
  const { loading: rosterLoading, roster } = useRoster();
  console.log(roster);
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="col-span-4">
        <div className="border-l-4 border-blue-500 pl-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Next Class
          </h3>
        </div>
        <div>
          <p>01-01-26 -- Zephyr</p>
        </div>
      </Card>
      <Card className="col-span-2">
        <div className="border-l-4 border-blue-500 pl-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Your Upcoming Scenes
          </h3>
        </div>
        <div className="flex gap-2">
          <Badge color="blue">1/1</Badge>
          <p>Hamlet - Monologue - 5 min</p>
        </div>
      </Card>
      <Card className="col-span-2">
        <div className="border-l-4 border-blue-500 pl-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white ">
            All Your Scenes
          </h3>
        </div>
        <div className="flex gap-2">
          <Badge color="blue">1/1</Badge>
          <p>Hamlet - Monologue - 5 min</p>
        </div>
        <div className="flex gap-2">
          <p>Hamlet - Monologue - 5 min</p>
        </div>
        <div className="flex gap-2">
          <p>Hamlet - Monologue - 5 min</p>
        </div>
      </Card>
      <Card className="col-span-4">
        <div className="border-l-4 border-blue-500 pl-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white ">
            Roster
          </h3>
        </div>
        <BasicGrid
          data={roster}
          loading={rosterLoading}
          colDefs={UsersColumns}
          pagination={false}
        />
      </Card>
    </div>
  );
};
