"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Switch from "../switch";
import { BiImport } from "react-icons/bi";
import { MdContentCopy, MdDelete, MdSave } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import classnames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import {
  selectItems,
  selectPrepend,
  selectCopyWithLinks,
  setItems,
  togglePrepend,
  toggleCopyWithLinks,
} from "../../features/references/reference-slice";
import { renderWithLinksHrefOnly } from "../utils";
import { createProjectAction } from "../../features/projects/project-slice";
import { AppDispatch, RootState } from "../../store/store";

interface ToolBarProps {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ToolBar({ setModalIsOpen }: ToolBarProps) {
  const items = useSelector(selectItems);
  const prepend = useSelector(selectPrepend);
  const copyWithLinks = useSelector(selectCopyWithLinks);
  const dispatch = useDispatch<AppDispatch>();
  const [projectTitle, setProjectTitle] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);

  const [isScrolled, setIsScrolled] = useState(false);

  const handleSaveProject = () => {
    if (!user) {
      toast("Please sign in to create a project");
      return;
    }
    dispatch(
      createProjectAction({
        title: projectTitle,
        items: items.map((item) => item.content),
        uid: user.uid,
      })
    );
    setProjectTitle(""); // Clear the input field
  };

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
        "flex items-center justify-between w-full sticky top-0 dark:text-white transition-all duration-100",
        {
          "shadow-lg rounded-full bg-white dark:bg-darkColor top-[100px] py-5 px-7":
            isScrolled,
        }
      )}
    >
      <div className="flex space-x-2">
        <a data-tooltip-id="save" data-tooltip-content="Save project">
          <button
            onClick={handleSaveProject}
            className="hover:text-white text-green-500 hover:bg-green-500 p-2 hover:shadow-md rounded"
          >
            <MdSave size={24} />
          </button>
          <Tooltip id="save" place="bottom" />
        </a>
        <input
          type="text"
          disabled={!user}
          className="bg-white dark:bg-darkColor rounded p-2 w-full border border-gray-300 dark:border-none dark:outline-none color-transition-applied"
          placeholder="New project"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />
      </div>
      <div className="flex space-x-6">
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
          <a data-tooltip-id="import" data-tooltip-content="Import references">
            <button
              onClick={() => setModalIsOpen(true)}
              className="bg-green-500 dark:hover:bg-green-500 dark:bg-green-600 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              <BiImport size={24} />
            </button>
            <Tooltip id="import" place="bottom" />
          </a>

          <a data-tooltip-id="copy" data-tooltip-content="Copy to clipboard">
            <button
              onClick={handleCopyToClipboard}
              className={
                "  disabled:bg-green-200 dark:disabled:bg-green-800 disabled:cursor-not-allowed bg-green-500 dark:bg-green-600 dark:hover:bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              }
              disabled={items.length === 0}
            >
              <MdContentCopy size={24} />
            </button>

            <Tooltip id="copy" place="bottom" />
          </a>

          <a
            data-tooltip-id="delete"
            data-tooltip-content="Delete all references"
          >
            <button
              onClick={handleClearItems}
              className={
                "disabled:bg-red-200 dark:disabled:bg-red-800 disabled:cursor-not-allowed bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
              }
              disabled={items.length === 0}
            >
              <MdDelete size={24} />
            </button>
            <Tooltip id="delete" place="bottom" />
          </a>
        </div>
      </div>
    </div>
  );
}
