import React, { ChangeEvent, KeyboardEvent, useState } from "react";

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
  );
}
