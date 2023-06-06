"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Switch from "./switch";

type Item = {
  id: string;
  content: string;
};

export default function ReferenceSorter() {
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [prepend, setPrepend] = useState(false);

  function handleAddItem() {
    if (inputValue !== "") {
      const newItem = { id: Date.now().toString(), content: inputValue };
      setItems(prepend ? [newItem, ...items] : [...items, newItem]);
      setInputValue("");
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleRemoveItem(index: number) {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  }

  function handleOnDragEnd(result: any) {
    if (!result.destination) return;
    const itemsArray = Array.from(items);
    const [reorderedItem] = itemsArray.splice(result.source.index, 1);
    itemsArray.splice(result.destination.index, 0, reorderedItem);
    setItems(itemsArray);
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrepend(e.target.checked);
  }

  return (
    <div className=" dark:bg-gray-800 p-6 w-full">
      <Switch
        label={"Add to start"}
        prepend={prepend}
        onChange={handleCheckboxChange}
      />

      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add reference"
          className="bg-white dark:bg-gray-200 rounded p-2 w-full mb-4 border border-gray-300 dark:border-gray-700 mr-1"
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          +
        </button>
      </div>

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
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-white dark:bg-gray-200 p-4 rounded mb-2 ${
                        snapshot.isDragging ? "shadow-lg" : ""
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>
                          [{index + 1}] {item.content}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-5"
                        >
                          x
                        </button>
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
    </div>
  );
}
