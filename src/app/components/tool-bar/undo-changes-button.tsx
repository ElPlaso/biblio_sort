import { setTitle, setItems } from "@/app/features/references/reference-slice";
import { useChangesMade } from "@/app/features/references/use-changes-made";
import { transformItems } from "@/app/features/references/utils";
import { useDispatch } from "react-redux";
import { Tooltip } from "react-tooltip";
import { MdUndo } from "react-icons/md";

export default function UndoChangesButton(props: { disabled: boolean }) {
  const { initialItems, initialTitle } = useChangesMade();
  const dispatch = useDispatch();

  function handleUndo() {
    dispatch(setTitle(initialTitle));
    dispatch(setItems(transformItems(initialItems)));
  }

  return (
    <a data-tooltip-id="undo" data-tooltip-content="Revert">
      <button
        onClick={handleUndo}
        className={
          "enabled:hover:text-white text-gray-400 enabled:hover:bg-gray-400 p-2 dark:text-gray-100 enabled:dark:hover:text-white " +
          " enabled:dark:hover:bg-gray-100 enabled:dark:hover:bg-opacity-10  enabled:hover:shadow-md rounded disabled:opacity-50"
        }
        disabled={props.disabled}
      >
        <MdUndo size={24} />
      </button>
      <Tooltip id="undo" place="bottom" />
    </a>
  );
}
