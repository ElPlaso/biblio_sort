import React, { ChangeEvent } from "react";
import Modal from "react-modal";
import { MdContentPaste } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  selectImportValue,
  setImportValue,
  importItems,
} from "../../features/references/reference-slice";
import { selectTheme } from "../../features/theme/theme-slice";

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
  const theme = useSelector(selectTheme);

  const handleImport = () => {
    dispatch(importItems());
    setModalIsOpen(false);
  };

  function handleImportChange(e: ChangeEvent<HTMLTextAreaElement>) {
    dispatch(setImportValue(e.target.value));
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Import References"
      style={theme === "dark" ? darkStyles : lightStyles}
    >
      <div className="flex items-start justify-between ">
        <div className="flex items-start">
          <MdContentPaste size={24} className="mt-1" />
          <h3 className="text-2xl mb-4 ml-2">Paste</h3>
        </div>
        <button
          onClick={() => setModalIsOpen(false)}
          className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white font-bold py-1 px-3 rounded"
        >
          Close
        </button>
      </div>

      <textarea
        value={value}
        onChange={handleImportChange}
        className="w-full h-[450px] mb-2 resize-none border p-1 dark:bg-gray-700 dark:outline-none dark:border-gray-600"
      />
      <button
        onClick={handleImport}
        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        disabled={value === ""}
      >
        Add
      </button>
    </Modal>
  );
}

// Styles
const lightStyles = {
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
    zIndex: 200,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const darkStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgb(55 65 81 / 9)",
    paddingLeft: "20px",
    paddingRight: "20px",
    borderRadius: "4px",
    width: "600px",
    height: "600px",
    overflow: "auto",
    border: "none",
    zIndex: 200,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
