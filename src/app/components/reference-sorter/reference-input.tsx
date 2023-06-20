import React, { ChangeEvent, KeyboardEvent } from "react";
import {MdAdd} from 'react-icons/md';

import { useSelector, useDispatch } from "react-redux";
import {
  selectInputValue,
  addItem,
  setInputValue,
} from "../../features/references/reference-slice";

export default function ReferenceInput() {
  const inputValue = useSelector(selectInputValue);

  const dispatch = useDispatch();

  const handleAddItem = () => {
    dispatch(addItem(inputValue));
  };

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleAddItem();
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setInputValue(e.target.value));
  }

  return (
    <div className="flex justify-between items-center mt-4 mb-4">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Add reference"
        className="bg-white dark:bg-darkColor rounded p-2 w-full border border-gray-300 dark:border-none outline-none mr-2 color-transition-applied"
      />
      <button
        onClick={handleAddItem}
        className="flex flex-row items-center py-2 pl-2 pr-3 bg-blue-500 dark:bg-gray-500 dark:hover:bg-gray-600 text-white font-bold hover:shadow-lg"
      >
        <MdAdd size={24} />
        Add
      </button>
    </div>
  );
}
