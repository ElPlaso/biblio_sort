import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { renderWithLinks } from "../utils";
import { useSelector, useDispatch } from "react-redux";
import {
  selectItems,
  setItems,
  removeItem,
} from "../../features/references/reference-slice";
// import { MdRemove } from "react-icons/md";
import { AppDispatch } from "../../store/store";
import { MdMoreHoriz } from "react-icons/md";
import { MdRemoveCircleOutline, MdContentCopy } from "react-icons/md";

export default function ReferenceList() {
  const items = useSelector(selectItems);

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [editItem, setEditItem] = useState<{
    index: number;
    text: string;
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  function handleItemEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (editItem) {
      setEditItem({ ...editItem, text: e.target.value });
    }
  }

  function handleItemDoubleClick(index: number, text: string) {
    setEditItem({ index, text });
  }

  // Handle click outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Redux toolkit creates a "readonly" version of the state.
  // It uses Immer under the hood, which makes original state drafts "immutable".
  // So, the state cannot be directly mutated; instead, a new state needs to be produced.
  // A new object must be created when updating the content of an item.
  // Array.map() is used to create a new array.
  // For each item, if the current index matches the index of the item being edited, it returns a new object with the updated content.
  // Otherwise, it returns the item as is.

  function handleBlur(index: number) {
    if (editItem && index === editItem.index) {
      if (editItem.text.trim() != "") {
        const newItems = items.map((item, idx) => {
          if (idx === editItem.index) {
            return { ...item, content: editItem.text };
          }
          return item;
        });
        dispatch(setItems(newItems));
      }
      setEditItem(null);
    }
  }

  function handleItemEditKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === "Enter") {
      handleBlur(index);
    }
  }

  function handleRemoveItem(index: number) {
    dispatch(removeItem(index));
  }

  function handleOnDragEnd(result: any) {
    if (!result.destination) return;
    const itemsArray = Array.from(items);
    const [reorderedItem] = itemsArray.splice(result.source.index, 1);
    itemsArray.splice(result.destination.index, 0, reorderedItem);

    const newItems = itemsArray.map((item, index) => {
      if (editItem && editItem.index === result.source.index) {
        return { ...item, content: editItem.text };
      }
      return item;
    });

    const newEditItemIndex =
      editItem && editItem.index === result.source.index
        ? result.destination.index
        : editItem && result.source.index < result.destination.index
        ? editItem.index - 1
        : editItem && result.source.index > result.destination.index
        ? editItem.index + 1
        : editItem && result.source.index === result.destination.index
        ? result.destination.index
        : null;

    dispatch(setItems(newItems));
    setEditItem((prevEditItem) =>
      prevEditItem ? { ...prevEditItem, index: newEditItemIndex } : null
    );
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="items">
        {(provided) => (
          <ul
            className="items"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    onDoubleClick={() => {
                      return handleItemDoubleClick(index, item.content);
                    }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`color-transition-applied bg-white shadow-md dark:bg-darkColor p-4 rounded-lg mb-2 ${
                      snapshot.isDragging ||
                      (editItem && editItem.index === index)
                        ? "shadow-lg"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start ">
                      <span className="mr-2">[{index + 1}]</span>
                      {editItem && editItem.index === index ? (
                        <input
                          type="text"
                          value={editItem.text}
                          onChange={handleItemEditChange}
                          onBlur={() => handleBlur(index)}
                          onKeyDown={(e) => handleItemEditKeyDown(e, index)}
                          autoFocus
                          className="flex-grow mr-4 pl-1 -ml-1 focus:outline-none  dark:bg-darkColor"
                        />
                      ) : (
                        <div className="flex-grow">
                          <span
                            onClick={() =>
                              handleItemDoubleClick(index, item.content)
                            }
                            className="cursor-text"
                            dangerouslySetInnerHTML={{
                              __html: renderWithLinks(item.content),
                            }}
                          />
                        </div>
                      )}
                      {!snapshot.isDragging && (
                        <div className="relative inline-block text-left">
                          <div>
                            <button
                              type="button"
                              className={
                                dropdownOpen === item.id ? "hidden" : ""
                              }
                              onClick={() => {
                                setDropdownOpen(item.id);
                              }}
                              id="menu-button"
                              aria-haspopup="true"
                            >
                              <MdMoreHoriz size={20} />
                            </button>

                            {/* Display a different button when dropdown is open */}
                            {dropdownOpen === item.id && (
                              <button
                                type="button"
                                onClick={() => setDropdownOpen(null)}
                                id="menu-close-button"
                                aria-haspopup="true"
                              >
                                <MdMoreHoriz size={20} />
                              </button>
                            )}
                          </div>

                          {dropdownOpen === item.id && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-darkColor shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="menu-button"
                              tabIndex={-1}
                            >
                              <div>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigator.clipboard.writeText(item.content);
                                  }}
                                  className="flex flex-row w-full justify-between items-center text-gray-700 dark:text-white px-4 py-2 text-sm hover:bg-gray-200  dark:hover:bg-gray-50 dark:hover:bg-opacity-10"
                                  role="menuitem"
                                  tabIndex={-1}
                                  id="menu-item-1"
                                >
                                  Copy
                                  <MdContentCopy />
                                </a>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveItem(index);
                                  }}
                                  className="flex flex-row w-full justify-between items-center text-gray-700 dark:text-white px-4 py-2 text-sm hover:bg-gray-200  dark:hover:bg-gray-50 dark:hover:bg-opacity-10"
                                  role="menuitem"
                                  tabIndex={-1}
                                  id="menu-item-0"
                                >
                                  Remove
                                  <MdRemoveCircleOutline />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
