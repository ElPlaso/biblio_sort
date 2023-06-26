import React, { ChangeEvent, KeyboardEvent, useState, useRef } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import {
  selectInputValue,
  addItem,
  setInputValue,
} from "../../features/references/reference-slice";
import { generateCitation } from "@/app/features/references/utils";
import classNames from "classnames";
import toast from "react-hot-toast";
import CircleLoader from "../circle-loader/circle-loader";
import { Tooltip } from "react-tooltip";

export default function ReferenceInput() {
  const inputValue = useSelector(selectInputValue);
  const [citeFromWeb, setCiteFromWeb] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedCitation, setGeneratedCitation] = useState<string>("");
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleButtonClick = () => {
    if (citeFromWeb) {
      if (inputValue.trim() !== "") {
        generateCitationFromWeb(inputValue);
      }
    } else {
      dispatch(addItem(inputValue));
    }
  };

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleButtonClick();
    }
  }

  function handleAddCitation() {
    dispatch(addItem(generatedCitation));
    setGeneratedCitation("");
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setInputValue(e.target.value));
  }

  async function generateCitationFromWeb(url: string) {
    setIsLoading(true);
    try {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      const citation = await generateCitation(url);
      setGeneratedCitation(citation);
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      setGeneratedCitation("");
      toast.error("Can not access url");
    }
  }

  function handleCitationFromWebToggle() {
    setCiteFromWeb(!citeFromWeb);
    dispatch(setInputValue(""));
    setGeneratedCitation("");
  }

  return (
    <div className="flex flex-col w-full space-y-2">
      <div
        className="flex items-center justify-center space-x-2 w-full"
        ref={dropdownRef}
      >
        <a
          data-tooltip-id={"web-cite"}
          data-tooltip-content={
            citeFromWeb ? "Enter reference" : "Cite from URL"
          }
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
        </a>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={citeFromWeb ? "Enter or paste URL" : "Add reference"}
          className="bg-white dark:bg-darkColor rounded p-2 w-full border border-gray-300 dark:border-none outline-none color-transition-applied"
        />

        <button
          onClick={handleButtonClick}
          className="flex flex-row items-center py-2 pl-2 pr-3 bg-blue-500  dark:hover:bg-blue-600 text-white font-bold hover:shadow-lg"
        >
          {citeFromWeb ? <MdSearch size={24} /> : <MdAdd size={24} />}
          {citeFromWeb ? "Cite" : "Add"}
        </button>
      </div>
      {(isLoading || generatedCitation) && (
        <div className="w-full p-4 shadow-lg rounded-lg bg-white dark:bg-darkColor">
          {isLoading ? (
            <div className="w-full text-center">
              <CircleLoader />
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <div className="flex flex-row w-full items-center justify-between ">
                <h1 className={"text-blue-500 font-medium cursor-default"}>
                  Generated Citation
                </h1>
                <div>
                  <button
                    onClick={handleAddCitation}
                    className="items-center w-[50px] rounded-full text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedCitation("");
                    }}
                    className="items-center w-[50px] rounded-full text-gray-500 hover:text-gray-600 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div>{generatedCitation}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
