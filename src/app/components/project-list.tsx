import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { MdAddCircle } from "react-icons/md";
import { RootState } from "../store/store";
import { AiOutlineFile } from "react-icons/ai";
import FlipMove from "react-flip-move";

export default function ProjectList() {
  const projects = useSelector((state: RootState) => state.projects.projects);

  const sortedProjects = [...projects].reverse();

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold w-full text-gray-600 ml-2 mb-3 dark:text-white">
        Projects
      </h1>
      <Link
        className="rounded-lg bg-gray-100 dark:bg-darkColor w-full px-3 py-2 flex items-center justify-between border z-20 hover:shadow-md color-transition-applied"
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
            className=" bg-white dark:bg-darkColor dark:hover:bg-darkColor color-transition-applied"
          >
            <Link href={`/project?id=${project.id}`} key={project.id}>
              <h2 className="flex p-3 space-x-2 items-center text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white">
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
