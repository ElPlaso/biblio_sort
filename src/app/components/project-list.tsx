import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { MdAddCircle } from "react-icons/md";
import { RootState } from "../store/store";

export default function ProjectList() {
  const projects = useSelector((state: RootState) => state.projects.projects);

  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl font-bold w-full text-gray-600 dark:text-white">
        Projects
      </h1>
      <div className="border-t border-gray-200 dark:border-gray-700" />
      <button className="rounded bg-gray-100 dark:bg-gray-300 w-full px-3 py-2 flex items-center justify-between shadow-md hover:shadow-lg color-transition-applied">
        <h2 className=" text-gray-700 font-medium dark:text-gray-800">
          New Project
        </h2>
        <MdAddCircle
          className="inline-block text-gray-300 dark:text-gray-400"
          size={35}
        />
      </button>
      <div className="flex flex-col space-y-2">
        {projects.map((project) => (
          <Link href={"/"} key={project.id}>
            <div
              key={project.id}
              className=" bg-white dark:bg-gray-600 p-3 rounded-md hover:shadow-sm color-transition-applied border dark:border-none"
            >
              <h2>{project.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
