import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { IconTypes } from "./types.ts";

export const GRID_HEIGHT = "520px";

export const TableActiveIcons = ({ type }: { type: IconTypes }) => {
  switch (type) {
    case "success":
      return (
        <CheckCircleIcon
          data-cy={CT.agGrid.success}
          className="h-6 w-6 text-green-500"
        />
      );
    case "warning":
      return (
        <ClockIcon
          data-cy={CT.agGrid.warning}
          className="h-6 w-6 text-yellow-500"
        />
      );
    case "failure":
      return (
        <XCircleIcon
          data-cy={CT.agGrid.failure}
          className="h-6 w-6 text-red-500"
        />
      );
  }
};
