"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Switch from "./switch";
import copy from "copy-to-clipboard";
import { MdContentCopy, MdContentPaste, MdDelete } from "react-icons/md";
import { BiImport } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import toast, { Toaster } from "react-hot-toast";
import Modal from "react-modal";

type Item = {
  id: string;
  content: string;
};

export default function ReferenceSorter() {
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [importValue, setImportValue] = useState("");
  const [prepend, setPrepend] = useState(false);
  const [editItem, setEditItem] = useState<{
    index: number;
    text: string;
  } | null>(null);

  function handleAddItem() {
    if (inputValue !== "") {
      const newItem = { id: Date.now().toString(), content: inputValue };
      setItems(prepend ? [newItem, ...items] : [...items, newItem]);
      setInputValue("");
    }
  }

  function handleItemEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (editItem) {
      setEditItem({ ...editItem, text: e.target.value });
    }
  }

  function handleItemDoubleClick(index: number, text: string) {
    setEditItem({ index, text });
  }

  function handleBlur(index: number) {
    if (editItem && index === editItem.index) {
      if (editItem.text.trim() != "") {
        const newItems = [...items];
        newItems[editItem.index].content = editItem.text;
        setItems(newItems);
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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleImportChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setImportValue(e.target.value);
  }

  function handleImport() {
    const newItems = importValue
      .split("\n\n")
      .filter((content) => content.trim() !== "") // Filter out empty strings
      .map((content) => content.replace(/^\[\d+\]\s/, "")) // Removing numbers
      .map((content, index) => ({
        id: `${Date.now().toString()}-${index}`,
        content: content.trim(),
      }));

    setItems(prepend ? [...newItems, ...items] : [...items, ...newItems]); // Adding to start if prepend is true
    setImportValue("");
    setModalIsOpen(false);
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

    setItems(newItems);
    setEditItem((prevEditItem) =>
      prevEditItem ? { ...prevEditItem, index: newEditItemIndex } : null
    );
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrepend(e.target.checked);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleAddItem();
    }
  }

  function handleCopyToClipboard() {
    const formattedItems = items
      .map((item, index) => `[${index + 1}] ${item.content}`)
      .join("\n\n");
    let copied = copy(formattedItems);
    if (copied) {
      toast.success("Copied to clipboard");
    }
  }

  return (
    <div className=" dark:bg-gray-800 p-6 w-full">
      <div className="flex items-start justify-end mb1 w-full">
        <div className="flex">
          <div className="mr-1">
            <a
              data-tooltip-id="import"
              data-tooltip-content="Import references"
            >
              <button
                onClick={() => setModalIsOpen(true)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
              >
                <BiImport size={24} />
              </button>
            </a>
            <Tooltip id="import" />
          </div>
          <div className="mr-1">
            <a data-tooltip-id="copy" data-tooltip-content="Copy to clipboard">
              <button
                onClick={handleCopyToClipboard}
                className={
                  "disabled:bg-green-200 disabled:cursor-not-allowed bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                }
                disabled={items.length === 0}
              >
                <MdContentCopy size={24} />
              </button>
            </a>

            <Tooltip id="copy" />
            <Toaster />
          </div>
          <div>
            <a
              data-tooltip-id="delete"
              data-tooltip-content="Delete all references"
            >
              <button
                onClick={() => {
                  setItems([]);
                }}
                className={
                  "disabled:bg-red-200 disabled:cursor-not-allowed bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                }
                disabled={items.length === 0}
              >
                <MdDelete size={24} />
              </button>
            </a>

            <Tooltip id="delete" />
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Import References"
        style={customModalStyles}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <MdContentPaste size={24} className="mt-1" />
            <h3 className="text-2xl mb-4 ml-2">Paste</h3>
          </div>
          <button
            onClick={() => setModalIsOpen(false)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          >
            Close
          </button>
        </div>

        <textarea
          value={importValue}
          onChange={handleImportChange}
          className="w-full h-[450px] mb-2 resize-none border p-1"
        />
        <button
          onClick={handleImport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={importValue === ""}
        >
          Add
        </button>
      </Modal>

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
          onKeyDown={handleKeyDown}
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
    </div>
  );
}

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    paddingLeft: "20px",
    paddingRight: "20px",
    borderRadius: "4px",
    width: "600px",
    height: "600px",
    overflow: "auto",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

function renderWithLinks(text: string) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlPattern, function (url) {
    return `<a href="${url}" target="_blank" class='text-blue-600' rel="noopener noreferrer">${url}</a>`;
  });
}
