import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type IconTypes = "warning" | "success" | "failure";

export const TableActiveIcons = ({ type }: { type: IconTypes }) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    case "warning":
      return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    case "failure":
      return <XCircleIcon className="h-6 w-6 text-red-500" />;
  }
};
