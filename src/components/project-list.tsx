import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { MdAddCircle } from "react-icons/md";
import { AppDispatch, RootState } from "@/lib/store/store";
import { AiOutlineFile } from "react-icons/ai";
import FlipMove from "react-flip-move";
import classnames from "classnames";
import { useSearchParams } from "next/navigation";
import MoreButtonDropdown from "./more-button-dropdown";
import { useEffect, useRef, useState } from "react";
import { RxCrumpledPaper } from "react-icons/rx";
import { deleteProjectAction } from "@/lib/features/projects/project-slice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BiCheck } from "react-icons/bi";

export default function ProjectList() {
  const projects = useSelector((state: RootState) => state.projects.projects);
  const sortedProjects = [...projects].reverse();
  const currentId = useSearchParams().get("id");
  const [hideDropdown, setHideDropdown] = useState<boolean>(false);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const loading = useSelector((state: RootState) => state.projects.loading);

  useEffect(() => {
    const handleScroll = () => {
      setHideDropdown(true);
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const deleteProject = (id: string) => {
    dispatch(deleteProjectAction(id))
      .then(() => {
        if (currentId == id) {
          router.replace("/");
        }
      })
      .then(() => setDeleteConfirm(false))
      .then(() => {
        toast.success("Project discarded");
      });
  };

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="pl-4">
        <Link
          className={classnames(
            "rounded-lg  w-full px-3 py-2 flex items-center justify-between border z-20 hover:shadow-md  ",
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
      </div>
      <div className="project-list overflow-y-scroll" ref={scrollContainerRef}>
        <FlipMove className="flex flex-col">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className={classnames(
                "flex flex-row p-3 hover:text-black  dark:hover:text-white",
                {
                  "text-black dark:text-white bg-gray-50 dark:bg-opacity-10 rounded-r-lg":
                    currentId == project.id,
                  "text-gray-500 dark:text-gray-400": currentId != project.id,
                }
              )}
            >
              <Link
                href={`/project?id=${project.id}`}
                key={project.id}
                className="flex w-full truncate"
              >
                <h1 className="flex space-x-2 items-center w-full">
                  <AiOutlineFile size={17} className="flex-shrink-0" />
                  <span className="truncate">
                    {project.title.trim() != "" ? project.title : "New project"}
                  </span>
                </h1>
              </Link>
              <MoreButtonDropdown
                hideDropdownOption={[hideDropdown, setHideDropdown]}
                onButtonClick={() => {
                  setDeleteConfirm(false);
                }}
                disabled={loading}
                items={
                  deleteConfirm
                    ? [
                        {
                          id: "confirm",
                          label: "Confirm discard",
                          onClick: (e) => {
                            e.preventDefault();
                            deleteProject(project.id);
                          },
                          icon: <BiCheck size={20} />,
                        },
                      ]
                    : [
                        {
                          id: "delete",
                          label: "Discard project",
                          onClick: (e) => {
                            e.preventDefault();
                            setDeleteConfirm(true);
                          },
                          icon: <RxCrumpledPaper size={20} />,
                        },
                      ]
                }
              />
            </div>
          ))}
        </FlipMove>
      </div>
      <style>
        {`
        .project-list::-webkit-scrollbar {
          width: 0px;
        }
        `}
      </style>
    </div>
  );
}
