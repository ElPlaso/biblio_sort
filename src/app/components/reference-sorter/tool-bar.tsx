"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import Switch from "../switch";
import { BiImport } from "react-icons/bi";
import { MdContentCopy, MdDelete } from "react-icons/md";
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

interface ToolBarProps {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ToolBar({ setModalIsOpen }: ToolBarProps) {
  const items = useSelector(selectItems);
  const prepend = useSelector(selectPrepend);
  const copyWithLinks = useSelector(selectCopyWithLinks);
  const dispatch = useDispatch();

  const [isScrolled, setIsScrolled] = useState(false);

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
          toast.error("Could not copy text: ", error);
        });
    } else {
      let copied = copy(formattedItems);
      if (copied) {
        toast.success("Copied to clipboard");
      }
    }
  }

  function handleClearItems() {
    dispatch(setItems([]));
  }

  return (
    <div
      className={classnames(
        "flex items-center justify-between p-5 w-full sticky top-0 dark:text-white",
        {
          "shadow-lg": isScrolled,
          "rounded-full": isScrolled,
          "bg-white": isScrolled,
          "dark:bg-black": isScrolled,
        }
      )}
    >
      <div className="flex">
        <Switch
          className="mr-4"
          label={"Add to start"}
          checked={prepend}
          id="prepend"
          onChange={handlePrependChange}
        />

        <Switch
          label={"Copy with links"}
          checked={copyWithLinks}
          id="copyWithLinks"
          onChange={handleCopyWithLinksChange}
        />
      </div>
      <div className="flex">
        <div className="mr-1">
          <a data-tooltip-id="import" data-tooltip-content="Import references">
            <button
              onClick={() => setModalIsOpen(true)}
              className="bg-green-500 dark:hover:bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              <BiImport size={24} />
            </button>
          </a>
          <Tooltip id="import" />
        </div>
        <div className="mr-1">
          <a data-tooltip-id="copy" data-tooltip-content="Copy to clipboard">
            <button
              onClick={handleCopyToClipboard}
              className={
                "  disabled:bg-green-200 dark:disabled:bg-green-800 disabled:cursor-not-allowed bg-green-500 dark:hover:bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              }
              disabled={items.length === 0}
            >
              <MdContentCopy size={24} />
            </button>
          </a>

          <Tooltip id="copy" />
        </div>
        <div>
          <a
            data-tooltip-id="delete"
            data-tooltip-content="Delete all references"
          >
            <button
              onClick={handleClearItems}
              className={
                "disabled:bg-red-200 dark:disabled:bg-red-800 disabled:cursor-not-allowed bg-red-500 dark:hover:bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              }
              disabled={items.length === 0}
            >
              <MdDelete size={24} />
            </button>
          </a>
          <Tooltip id="delete" />
        </div>
      </div>
    </div>
  );
}
