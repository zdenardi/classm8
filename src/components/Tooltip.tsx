import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
}

/** Used as a sub-component of FormLabel
 *  Displays a tooltip if 'tooltip' prop is passed to the parent component i.e TextInput or Select */
export default function Tooltip(props: TooltipProps) {
  const { content } = props;
  return (
    <Popover className="relative m-0 p-0 flex items-center">
      <PopoverButton className="ml-1 focus:outline-none">
        <InformationCircleIcon className="h-4.5 w-4.5 text-primary-t-50 stroke-2" />
      </PopoverButton>
      <PopoverPanel
        anchor="top start"
        transition
        className="flex flex-col bg-white p-3 rounded-lg transition duration-200 ease-in-out [--anchor-gap:8px] shadow-lg  data-closed:-translate-y-1 data-closed:opacity-0 "
      >
        {content}
      </PopoverPanel>
    </Popover>
  );
}
