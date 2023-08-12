import React, { ChangeEvent, KeyboardEvent } from "react";
import { MdAdd } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  selectInputValue,
  addItem,
  setInputValue,
} from "@/lib/features/references/reference-slice";

export default function ReferenceInput() {
  const inputValue = useSelector(selectInputValue);
  const dispatch = useDispatch();

  const handleButtonClick = () => {
    dispatch(addItem(inputValue));
  };

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleButtonClick();
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setInputValue(e.target.value));
  }

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="flex items-center justify-center space-x-2 w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={"Add reference"}
          className="bg-white dark:bg-darkColor rounded p-2 w-full border border-gray-300 dark:border-none outline-none  "
        />

        <button
          onClick={handleButtonClick}
          className="flex flex-row items-center py-2 pl-2 pr-3 bg-blue-500  dark:hover:bg-blue-600 text-white font-bold hover:shadow-lg"
        >
          <MdAdd size={24} />
          Add
        </button>
      </div>
    </div>
  );
}
