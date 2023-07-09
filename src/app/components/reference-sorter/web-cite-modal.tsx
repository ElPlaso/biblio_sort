import React, { useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { addItem } from "../../features/references/reference-slice";
import { generateCitation } from "@/app/features/references/utils";
import CircleLoader from "../circle-loader/circle-loader";
import BibModal from "./bib-modal";

interface WebCiteModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WebCiteModal({
  modalIsOpen,
  setModalIsOpen,
}: WebCiteModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedCitation, setGeneratedCitation] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const dispatch = useDispatch();

  function handleAddCitation() {
    dispatch(addItem(generatedCitation));
    setModalIsOpen(false);
    setGeneratedCitation("");
    setUrl("");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleGenerateCitation();
    }
  }

  async function handleGenerateCitation() {
    setInput("");
    setError(false);
    await generateCitationFromWeb(input);
  }

  async function generateCitationFromWeb(url: string) {
    setIsLoading(true);
    try {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      setUrl(url);
      const citation = await generateCitation(url);
      setGeneratedCitation(citation);
      setIsLoading(false);
    } catch (e: any) {
      setError(true);
      setIsLoading(false);
      setGeneratedCitation("");
    }
  }

  function handleModalClose() {
    setModalIsOpen(false);
    setGeneratedCitation("");
    setInput("");
    setUrl("");
    setError(false);
  }

  function handleCloseErrorMessage() {
    setError(false);
  }

  return (
    <BibModal modalIsOpen={modalIsOpen} handleModalClose={handleModalClose}>
      <div className="flex flex-col lg:w-[600px] md:w-[400px] space-y-3">
        <div className="flex items-start justify-between ">
          <div className="flex">
            <TbWorldWww size={20} className="mt-1" />
            <h3 className="text-xl ml-2">Web Cite</h3>
          </div>
          <button onClick={handleModalClose}>
            <MdClose size={24} />
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2 w-full">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={"Enter or paste URL"}
            className="bg-white dark:bg-darkColor rounded p-2 w-full border border-gray-300 dark:border-none outline-none color-transition-applied"
          />

          <button
            onClick={handleGenerateCitation}
            className="flex flex-row items-center py-2 pl-2 pr-3 bg-blue-500  dark:hover:bg-blue-600 text-white font-bold hover:shadow-lg"
          >
            <MdSearch size={24} />
            Find
          </button>
        </div>

        {(isLoading || generatedCitation || error) && (
          <div className="w-full p-4 shadow-lg rounded-lg bg-white dark:bg-darkColor">
            {isLoading ? (
              <div className="w-full text-center">
                <CircleLoader />
              </div>
            ) : error ? (
              <div className="flex flex-col space-y-1">
                <div className="flex flex-row w-full items-center justify-between ">
                  <h1 className={"text-red-500 font-medium cursor-default"}>
                    Error
                  </h1>
                  <div>
                    <button
                      onClick={handleCloseErrorMessage}
                      className="items-center w-[50px] rounded-full text-gray-500 hover:text-gray-600 font-medium"
                    >
                      Okay
                    </button>
                  </div>
                </div>
                <div>An error occurred while trying to access: {url}</div>
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
    </BibModal>
  );
}
