"use client";

import { useState } from "react";
import ToolBar from "./reference-sorter/tool-bar";
import ImportModal from "./reference-sorter/import-modal";
import ReferenceInput from "./reference-sorter/reference-input";
import ReferenceList from "./reference-sorter/reference-list";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { selectTheme } from "../features/theme/theme-slice";

export default function ReferenceSorter() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const loading = useSelector((state: RootState) => state.projects.loading);
  const theme = useSelector(selectTheme);

  return (
    <div className="flex-grow flex-col min-h-full p-8 rounded-tl-3xl shadow-lg border dark:border-none bg-gray-50 dark:bg-opacity-10 space-y-4">
      <ToolBar setModalIsOpen={setModalIsOpen} modalIsOpen={modalIsOpen} />

      <ImportModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />

      <ReferenceInput />

      {loading ? (
        <div>
          <Skeleton
            height={55}
            containerClassName="space-y-2"
            count={5}
            baseColor={theme == "dark" ? "#181818" : ""}
            highlightColor={theme == "dark" ? "#282828" : ""}
          />
        </div>
      ) : (
        <ReferenceList />
      )}
    </div>
  );
}
