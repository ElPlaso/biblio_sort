"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import toast from "react-hot-toast";
import Switch from "../switch";
import { BiImport } from "react-icons/bi";
import { MdContentCopy, MdDeleteOutline } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import classnames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import {
  selectItems,
  selectPrepend,
  selectCopyWithLinks,
  setItems,
  setTitle,
  togglePrepend,
  toggleCopyWithLinks,
} from "../../features/references/reference-slice";
import { renderWithLinksHrefOnly } from "../utils";
import { getTitle } from "../../features/projects/project-slice";
import { AppDispatch, RootState } from "../../store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ToolBarActionButton from "../tool-bar/tool-bar-action-button";
import classNames from "classnames";
import { selectTheme } from "@/app/features/theme/theme-slice";
import SaveProjectButton from "../tool-bar/save-project-button";
import UndoChangesButton from "../tool-bar/undo-changes-button";
import { useChangesMade } from "@/app/features/references/use-changes-made";

interface ToolBarProps {
  setImportOpen: Dispatch<SetStateAction<boolean>>;
  setWebCiteOpen: Dispatch<SetStateAction<boolean>>;
  aModalIsOpen: boolean;
}

export default function ToolBar({
  setImportOpen,
  setWebCiteOpen,
  aModalIsOpen,
}: ToolBarProps) {
  const items = useSelector(selectItems);
  const prepend = useSelector(selectPrepend);
  const copyWithLinks = useSelector(selectCopyWithLinks);
  const dispatch = useDispatch<AppDispatch>();
  const [titleInputValue, setTitleInputValue] = useState("");
  const projectId = useSelector(
    (state: RootState) => state.references.projectId
  );
  const [editingTitle, setEditingTitle] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const loading = useSelector((state: RootState) => state.projects.loading);
  const currentTitle = useSelector(
    (state: RootState) => state.references.title
  );

  const { itemsChanged, titleChanged } = useChangesMade();

  useEffect(() => {
    if (!projectId) return;
    // get title of project with given id
    dispatch(getTitle(projectId)).then((result) => {
      const title = unwrapResult(result);
      setTitleInputValue(title);
      dispatch(setTitle(title));
    });
  }, [projectId, dispatch]);

  useEffect(() => {
    setTitleInputValue(currentTitle || "");
  }, [currentTitle]);

  const [isScrolled, setIsScrolled] = useState(false);

  const theme = useSelector(selectTheme);

  const handleTitleChange = useCallback(() => {
    dispatch(setTitle(titleInputValue));
    setEditingTitle(false);
  }, [dispatch, titleInputValue]);

  // close the title input field and handle title change when clicked outside
  useEffect(() => {
    function handleClickOutside(event: { target: any }) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        handleTitleChange();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleTitleChange]);

  // focus the input field when title is clicked
  useEffect(() => {
    if (editingTitle) {
      inputRef.current?.focus();
    }
  }, [editingTitle]);

  useEffect(() => {
    const checkScroll = () => {
      if (window.pageYOffset > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  function handlePrependChange() {
    dispatch(togglePrepend());
  }

  function handleCopyWithLinksChange() {
    dispatch(toggleCopyWithLinks());
  }

  function handleCopyToClipboard() {
    const formattedItems = items
      .map(
        (item, index) =>
          `[${index + 1}] ${
            copyWithLinks ? renderWithLinksHrefOnly(item.content) : item.content
          }`
      )
      .join("\n\n");

    if (copyWithLinks) {
      const formattedItemsHTML = formattedItems.replace(/\n/g, "<br />");
      navigator.clipboard
        .write([
          new ClipboardItem({
            "text/html": new Blob([formattedItemsHTML], { type: "text/html" }),
            "text/plain": new Blob([formattedItems], { type: "text/plain" }),
          }),
        ])
        .then(() => {
          toast.success("Copied to clipboard with links");
        })
        .catch((error) => {
          toast.error("Could not copy text");
        });
    } else {
      navigator.clipboard
        .write([
          new ClipboardItem({
            "text/plain": new Blob([formattedItems], { type: "text/plain" }),
          }),
        ])
        .then(() => {
          toast.success("Copied to clipboard");
        })
        .catch((error) => {
          toast.error("Could not copy text");
        });
    }
  }

  function handleClearItems() {
    dispatch(setItems([]));
  }

  return (
    <div
      className={classnames(
        "flex lg:flex-row md:flex-col lg:justify-between md:items-start md:justify-center md:space-y-2 lg:items-center w-full sticky top-0 dark:text-white transition-all duration-100 space-x-2",
        {
          "shadow-lg rounded-full bg-white dark:bg-darkColor top-[100px] py-5 px-7 dark:shadow-xl z-20":
            isScrolled && !aModalIsOpen,
        }
      )}
    >
      <div className="flex space-x-3 items-center h-full w-full lg:max-w-[250px] md:max-w-[500px] truncate">
        {loading ? (
          <Skeleton
            containerClassName="flex-1"
            height={35}
            baseColor={theme == "dark" ? "#181818" : ""}
            highlightColor={theme == "dark" ? "#282828" : ""}
          />
        ) : editingTitle ? (
          <input
            type="text"
            ref={inputRef}
            maxLength={100}
            className="bg-white dark:bg-darkColor rounded p-2 w-full border border-gray-300 dark:border-none outline-none color-transition-applied text-left"
            value={titleInputValue}
            placeholder="New project"
            onChange={(e) => setTitleInputValue(e.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTitleChange();
              }
            }}
          />
        ) : (
          <button
            className={classNames(
              "dark:text-white cursor-text w-full truncate text-left md:p-2",
              {
                "text-gray-400 dark:text-opacity-20":
                  titleInputValue.trim() === "",
              }
            )}
            onClick={() => setEditingTitle(true)}
          >
            {titleInputValue.trim() === "" ? "New project" : titleInputValue}
          </button>
        )}
      </div>
      <div className="flex space-x-6 items-center w-full lg:justify-end md:justify-between">
        <div className="flex space-x-1">
          {projectId ? (
            <>
              <UndoChangesButton disabled={!(itemsChanged || titleChanged)} />
              <SaveProjectButton disabled={!(itemsChanged || titleChanged)} />
            </>
          ) : (
            // only and always allow save if new project
            <SaveProjectButton disabled={false} />
          )}
        </div>
        <div className="flex space-x-3">
          <Switch
            label={"Prepend"}
            checked={prepend}
            id="prepend"
            onChange={handlePrependChange}
          />

          <Switch
            label={"Copy links"}
            checked={copyWithLinks}
            id="copyWithLinks"
            onChange={handleCopyWithLinksChange}
          />
        </div>
        <div className="flex space-x-2">
          <ToolBarActionButton
            onClick={() => setWebCiteOpen(true)}
            id="web-cite"
            icon={<TbWorldWww size={24} />}
            place={"bottom"}
            tip={"Cite from web"}
            disabled={loading}
          />
          <ToolBarActionButton
            onClick={() => setImportOpen(true)}
            id="import"
            icon={<BiImport size={24} />}
            place={"bottom"}
            tip={"Import references"}
            disabled={loading}
          />
          <ToolBarActionButton
            onClick={handleCopyToClipboard}
            id="copy"
            icon={<MdContentCopy size={24} />}
            place={"bottom"}
            tip={"Copy to clipboard"}
            disabled={items.length === 0 || loading}
          />
          <ToolBarActionButton
            onClick={handleClearItems}
            id="delete"
            icon={<MdDeleteOutline size={24} />}
            place={"bottom"}
            tip={"Delete all references"}
            disabled={items.length === 0 || loading}
          />
        </div>
      </div>
    </div>
  );
}

{
  /* <a
          data-tooltip-id={"web-cite"}
          data-tooltip-content={"Enter reference"}
        >
          <button
            onClick={handleCitationFromWebToggle}
            className={classNames({
              "text-blue-500 hover:text-blue-600": citeFromWeb,
              "text-gray-500 hover:text-gray-600": !citeFromWeb,
            })}
          >
            <TbWorldWww size={30} />
          </button>
          <Tooltip id={"web-cite"} place={"bottom"} />
        </a> */
}
