import React, { ChangeEvent } from "react";
import Modal from "react-modal";
import { MdAdd, MdContentPaste, MdClose } from "react-icons/md";
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
        className="w-full mt-3 h-[460px] mb-2 resize-none border p-1 dark:bg-darkColor outline-none dark:border-none"
      />

      <button
        onClick={handleImport}
        className="w-full flex flex-row items-center disabled:shadow-none justify-center py-2 pl-2 pr-3 bg-blue-500 dark:hover:bg-blue-600 text-white font-bold hover:shadow-lg"
        disabled={value === ""}
      >
        Add
        <MdAdd size={24} />
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
    backgroundColor: "rgb(18 18 18 )",
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
