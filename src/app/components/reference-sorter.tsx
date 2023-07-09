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
import WebCiteModal from "./reference-sorter/web-cite-modal";

export default function ReferenceSorter() {
  const [importModalIsOpen, setImportModalIsOpen] = useState(false);
  const [webCiteModalIsOpen, setWebCiteModalIsOpen] = useState(false);
  const loading = useSelector((state: RootState) => state.projects.loading);
  const theme = useSelector(selectTheme);
  const items = useSelector((state: RootState) => state.references.items);
  const count = items.length;

  return (
    <div className="flex-grow flex-col min-h-full p-8 rounded-tl-3xl shadow-lg border dark:border-none bg-gray-50 dark:bg-opacity-10 space-y-4">
      <ToolBar
        setImportOpen={setImportModalIsOpen}
        setWebCiteOpen={setWebCiteModalIsOpen}
        aModalIsOpen={importModalIsOpen || webCiteModalIsOpen}
      />

      <ImportModal
        modalIsOpen={importModalIsOpen}
        setModalIsOpen={setImportModalIsOpen}
      />

      <WebCiteModal
        modalIsOpen={webCiteModalIsOpen}
        setModalIsOpen={setWebCiteModalIsOpen}
      />

      <ReferenceInput />

      {loading ? (
        <div>
          <Skeleton
            height={55}
            containerClassName="space-y-2"
            count={count}
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
