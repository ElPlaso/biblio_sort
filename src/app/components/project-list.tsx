import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { MdAddCircle } from "react-icons/md";
import { RootState } from "../store/store";
import { AiOutlineFile } from "react-icons/ai";
import FlipMove from "react-flip-move";
import classnames from "classnames";
import { useSearchParams } from "next/navigation";

export default function ProjectList() {
  const projects = useSelector((state: RootState) => state.projects.projects);

  const sortedProjects = [...projects].reverse();

  const currentId = useSearchParams().get("id");

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold w-full text-gray-600 ml-2 mb-3 dark:text-white">
        Projects
      </h1>
      <Link
        className={classnames(
          "rounded-lg  w-full px-3 py-2 flex items-center justify-between border z-20 hover:shadow-md color-transition-applied",
          {
            "bg-gray-200 dark:bg-opacity-10": !currentId,
            "bg-white dark:bg-darkColor": currentId,
          }
        )}
        href={"/"}
      >
        <h2 className=" text-gray-700 font-medium dark:text-gray-200 ">
          New Project
        </h2>
        <MdAddCircle
          className="inline-block text-gray-400 dark:text-gray-200 "
          size={35}
        />
      </Link>
      <FlipMove className="project-list flex flex-col overflow-y-scroll border-b-[1px]">
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-darkColor dark:hover:bg-darkColor color-transition-applied"
          >
            <Link href={`/project?id=${project.id}`} key={project.id}>
              <h2
                className={classnames(
                  "flex p-3 space-x-2 items-center text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white",
                  {
                    "text-black dark:text-white bg-gray-50 dark:bg-opacity-10 rounded":
                      currentId == project.id,
                  }
                )}
              >
                <AiOutlineFile size={17} />
                <span>
                  {project.title.trim() != "" ? project.title : "New project"}
                </span>
              </h2>
            </Link>
          </div>
        ))}
      </FlipMove>
      <style>
        {`
        .project-list::-webkit-scrollbar {
          width: 0px;
        `}
      </style>
    </div>
  );
}

{
  /* <div
className={classnames(
  "flex items-center justify-between w-full sticky top-0 dark:text-white transition-all duration-100",
  {
    "shadow-lg rounded-full bg-white dark:bg-darkColor top-[100px] py-5 px-7":
      isScrolled,
  }
)} */
}
