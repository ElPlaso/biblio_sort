import { PlacesType, Tooltip } from "react-tooltip";

interface ToolBarActionButtonProps {
  onClick: () => void;
  icon: JSX.Element;
  id: string;
  place: PlacesType;
  tip: string;
  disabled?: boolean;
}

export default function ToolBarActionButton({
  onClick,
  place,
  id,
  icon,
  tip,
  disabled,
}: ToolBarActionButtonProps) {
  return (
    <a data-tooltip-id={id} data-tooltip-content={tip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="bg-gray-100 disabled:bg-gray-200 dark:disabled:bg-opacity-5 dark:bg-opacity-20 border disabled:hover:shadow-none dark:border-none hover:shadow-lg font-bold py-2 px-2 rounded"
      >
        {icon}
      </button>
      <Tooltip id={id} place={place} />
    </a>
  );
}
