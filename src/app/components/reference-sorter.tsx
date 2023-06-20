"use client";

import { useState } from "react";
import ToolBar from "./reference-sorter/tool-bar";
import ImportModal from "./reference-sorter/import-modal";
import ReferenceInput from "./reference-sorter/reference-input";
import ReferenceList from "./reference-sorter/reference-list";

export default function ReferenceSorter() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="flex-grow min-h-full p-8 rounded-tl-3xl shadow-lg border dark:border-none bg-gray-50 dark:bg-opacity-10">
      <ToolBar setModalIsOpen={setModalIsOpen} />

      <ImportModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />

      <ReferenceInput />

      <ReferenceList />
    </div>
  );
}
