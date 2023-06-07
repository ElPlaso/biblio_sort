import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { renderWithLinks } from "../utils";
import { useSelector, useDispatch } from "react-redux";
import {
  selectItems,
  setItems,
  removeItem,
} from "../../features/references/reference-slice";

export default function ReferenceList() {
  const items = useSelector(selectItems);

  const [editItem, setEditItem] = useState<{
    index: number;
    text: string;
  } | null>(null);

  const dispatch = useDispatch();

  function handleItemEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (editItem) {
      setEditItem({ ...editItem, text: e.target.value });
    }
  }

  function handleItemDoubleClick(index: number, text: string) {
    setEditItem({ index, text });
  }

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
                    onDoubleClick={() =>
                      handleItemDoubleClick(index, item.content)
                    }
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white dark:bg-gray-200 p-4 rounded mb-2 ${
                      snapshot.isDragging ||
                      (editItem && editItem.index === index)
                        ? "shadow-lg"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="mr-2">[{index + 1}]</span>
                      {editItem && editItem.index === index ? (
                        <input
                          type="text"
                          value={editItem.text}
                          onChange={handleItemEditChange}
                          onBlur={() => handleBlur(index)}
                          onKeyDown={(e) => handleItemEditKeyDown(e, index)}
                          autoFocus
                          className="flex-grow mr-4 pl-1 -ml-1 focus:outline-none"
                        />
                      ) : (
                        <span
                          onClick={() =>
                            handleItemDoubleClick(index, item.content)
                          }
                          className="flex-grow cursor-text"
                          dangerouslySetInnerHTML={{
                            __html: renderWithLinks(item.content),
                          }}
                        ></span>
                      )}
                      {!snapshot.isDragging && (
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded select-none"
                        >
                          x
                        </button>
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
