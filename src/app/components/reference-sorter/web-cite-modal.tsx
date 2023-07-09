import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose, MdSearch } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../features/references/reference-slice";
import { selectTheme } from "../../features/theme/theme-slice";
import { generateCitation } from "@/app/features/references/utils";
import CircleLoader from "../circle-loader/circle-loader";

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
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  function handleAddCitation() {
    dispatch(addItem(generatedCitation));
    setModalIsOpen(false);
    setGeneratedCitation("");
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUrl(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleGenerateCitation();
    }
  }

  async function handleGenerateCitation() {
    setUrl("");
    await generateCitationFromWeb(url);
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
    }
  }

  function handleModalClose() {
    setModalIsOpen(false);
    setGeneratedCitation("");
    setUrl("");
    setError(false);
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleModalClose}
      contentLabel="Import References"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: theme === "dark" ? "rgb(18 18 18 )" : "white",
          padding: "20px",
          borderRadius: "4px",
          height: "fit-content",
          width: "fit-content",
          overflow: "auto",
          border: "none",
          zIndex: 200,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
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
            value={url}
            onChange={handleUrlChange}
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
    </Modal>
  );
}
