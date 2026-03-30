import classNames from "classnames/index.js";
import { UsersColumns } from "./constants.ts";
import { IUser } from "../../types/user.ts";
import { BasicGrid } from "../../components/agGrid/Grid.tsx";

interface Props {
  loading: boolean;
  data: IUser[];
}

export const UsersGrid = (props: Props) => {
  const { loading, data } = props;

  return (
    <div className={classNames("w-full", "border-2")}>
      <div className="p-4 space-y-4 mx-auto ">
        <h1 className="text-2xl font-semibold text-left">Users</h1>
        <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
          <BasicGrid
            loading={loading}
            data={data}
            colDefs={UsersColumns}
            pagination
          />
        </div>
      </div>
    </div>
  );
};
