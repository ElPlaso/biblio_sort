import React, { ChangeEvent } from "react";
import { MdAdd, MdContentPaste, MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  selectImportValue,
  setImportValue,
  importItems,
} from "@/lib/features/references/reference-slice";
import BibModal from "./bib-modal";

interface ImportModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImportModal({
  modalIsOpen,
  setModalIsOpen,
}: ImportModalProps) {
  const dispatch = useDispatch();
  const value = useSelector(selectImportValue);

  const handleImport = () => {
    dispatch(importItems());
    setModalIsOpen(false);
  };

  function handleImportChange(e: ChangeEvent<HTMLTextAreaElement>) {
    dispatch(setImportValue(e.target.value));
  }

  function handleModalClose() {
    setModalIsOpen(false);
    dispatch(setImportValue(""));
  }

  return (
    <BibModal modalIsOpen={modalIsOpen} handleModalClose={handleModalClose}>
      <div className="flex flex-col lg:h-[500px] md:h-[300px] lg:w-[600px] md:w-[400px]">
        <div className="flex items-start justify-between ">
          <div className="flex">
            <MdContentPaste size={20} className="mt-1" />
            <h3 className="text-xl ml-2">Paste</h3>
          </div>
          <button onClick={() => setModalIsOpen(false)}>
            <MdClose size={24} />
          </button>
        </div>

        <textarea
          value={value}
          onChange={handleImportChange}
          className="h-full resize-none border p-1 dark:bg-darkGray outline-none dark:border-none mt-3 mb-2"
        />

        <button
          onClick={handleImport}
          className="flex flex-row items-center disabled:shadow-none justify-center py-2 pl-2 pr-3 bg-blue-500 dark:hover:bg-blue-600 text-white font-bold hover:shadow-lg"
          disabled={value === ""}
        >
          Add
          <MdAdd size={24} />
        </button>
      </div>
    </BibModal>
  );
}
