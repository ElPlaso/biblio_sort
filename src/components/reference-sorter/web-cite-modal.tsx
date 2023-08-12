import React, { useState } from "react";
import { MdAdd, MdClose, MdSearch } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { addItem } from "@/lib/features/references/reference-slice";
import { generateCitation } from "@/lib/features/references/utils";
import {
  setImportValue,
  importItems,
} from "@/lib/features/references/reference-slice";
import CircleLoader from "../circle-loader/circle-loader";
import BibModal from "./bib-modal";
import FlipMove from "react-flip-move";
import { uid } from "uid";

interface WebCiteModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GeneratedCitation {
  id: string;
  citation: string;
}

export default function WebCiteModal({
  modalIsOpen,
  setModalIsOpen,
}: WebCiteModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedCitations, setGeneratedCitations] = useState<
    GeneratedCitation[]
  >([]);
  const [input, setInput] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const dispatch = useDispatch();

  function handleAddCitation(index: number) {
    dispatch(addItem(generatedCitations[index].citation));
    removeCitation(index);
    setUrl("");
  }

  function handleAddAllCitations() {
    // convert array to line separated string
    const citations = generatedCitations.map((citation) => citation.citation);
    const citationsString = citations.join("\n\n");
    dispatch(setImportValue(citationsString));
    dispatch(importItems());
    setModalIsOpen(false);
    setGeneratedCitations([]);
  }

  function removeCitation(index: number) {
    setGeneratedCitations((prev) => {
      const newCitations = [...prev];
      newCitations.splice(index, 1);
      return newCitations;
    });
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
      // add citation to start of list
      // create an instance of GeneratedCitation
      const citationObj: GeneratedCitation = {
        id: uid(),
        citation: citation,
      };
      setGeneratedCitations((prev) => [citationObj, ...prev]);
      setIsLoading(false);
    } catch (e: any) {
      setError(true);
      setIsLoading(false);
    }
  }

  function handleModalClose() {
    setModalIsOpen(false);
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
            <span className="text-xl ml-2 text-blue-400">beta</span>
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
            className="bg-white dark:bg-darkColor rounded p-2 w-full border border-gray-300 dark:border-none outline-none  "
          />

          <button
            onClick={handleGenerateCitation}
            className="flex flex-row items-center py-2 pl-2 pr-3 bg-blue-500  dark:hover:bg-blue-600 text-white font-bold hover:shadow-lg"
          >
            <MdSearch size={24} />
            Find
          </button>
        </div>

        <div className="web-cite-list lg:max-h-[400px] md:max-h-[300px] overflow-y-scroll space-y-2 px-2 pb-6">
          {isLoading ? (
            <div className="w-full p-4 shadow-lg rounded-lg bg-white dark:bg-darkColor">
              <div className="w-full text-center">
                <CircleLoader />
              </div>
            </div>
          ) : (
            error && (
              <div className="w-full p-4 shadow-lg rounded-lg bg-white dark:bg-darkColor">
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
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <div>An error occurred while trying to access: {url}</div>
                </div>
              </div>
            )
          )}
          <FlipMove className="space-y-2">
            {generatedCitations.map((citation, index) => (
              <div
                key={citation.id}
                className="w-full p-4 shadow-lg rounded-lg bg-white dark:bg-darkColor "
              >
                <div className="flex flex-col space-y-1">
                  <div className="flex flex-row w-full items-center justify-between ">
                    <h1 className={"text-blue-500 font-medium cursor-default"}>
                      Generated Citation
                    </h1>
                    <div>
                      <button
                        onClick={() => handleAddCitation(index)}
                        className="items-center w-[50px] rounded-full text-blue-500 hover:text-blue-600 font-medium"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedCitations((prev) => {
                            const newCitations = [...prev];
                            newCitations.splice(index, 1);
                            return newCitations;
                          });
                        }}
                        className="items-center w-[50px] rounded-full text-gray-500 hover:text-gray-600 font-medium"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                  <div>{citation.citation}</div>
                </div>
              </div>
            ))}
          </FlipMove>
          <style>
            {`
            .web-cite-list::-webkit-scrollbar {
              width: 0px;
            }
            `}
          </style>
        </div>
        <button
          onClick={handleAddAllCitations}
          className="flex flex-row items-center disabled:shadow-none justify-center py-2 pl-2 pr-3 bg-blue-500 dark:hover:bg-blue-600 text-white font-bold hover:shadow-lg"
          disabled={generatedCitations.length === 0}
        >
          Add All
          <MdAdd size={24} />
        </button>
      </div>
    </BibModal>
  );
}
