import {
  createProjectAction,
  updateProjectItemsAction,
  updateProjectTitleAction,
} from "../../features/projects/project-slice";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import { MdSave } from "react-icons/md";
import { SortableItem } from "@/app/types/sortable-item";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import toast from "react-hot-toast";
import { unwrapResult } from "@reduxjs/toolkit";
import { selectItems } from "@/app/features/references/reference-slice";
import { useEffect, useState } from "react";

// transforms an array of items into an array of strings
function transformItemsToStrings(items: SortableItem[]) {
  return items.map((item) => item.content);
}

// used for checking if items have been modified
function itemsEqual(items1: string[], items2: string[]) {
  if (items1 === items2) return true;
  if (items1 == null || items2 == null) return false;
  if (items1.length !== items2.length) return false;
  for (var i = 0; i < items1.length; ++i) {
    if (items1[i] !== items2[i]) return false;
  }
  return true;
}

export default function SaveProjectButton() {
  const dispatch = useDispatch<AppDispatch>();
  const projectId = useSelector(
    (state: RootState) => state.references.projectId
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const items = useSelector(selectItems);
  const currentTitle = useSelector(
    (state: RootState) => state.references.title
  );
  const router = useRouter();
  const projects = useSelector((state: RootState) => state.projects.projects);

  const [initialItems, setInitialItems] = useState([] as string[]);
  const [initialTitle, setInitialTitle] = useState("");

  useEffect(() => {
    const currentProject = projects.find((project) => project.id === projectId);
    setInitialItems(currentProject?.items!);
    setInitialTitle(currentProject?.title!);
  }, [projects, projectId]);

  const handleSaveProject = async () => {
    if (!user) {
      toast("Please sign in to create a project");
      return;
    }
    if (projectId) {
      // update existing project

      const itemsAsStrings = transformItemsToStrings(items);
      const itemsChanged = !itemsEqual(itemsAsStrings, initialItems);
      const titleChanged = currentTitle !== initialTitle;
      const makeChanges = async () => {
        if (itemsChanged) {
          await dispatch(
            updateProjectItemsAction({
              projectId: projectId,
              items: itemsAsStrings,
            })
          );
        }
        if (titleChanged) {
          await dispatch(
            updateProjectTitleAction({
              title: currentTitle || "",
              projectId: projectId,
            })
          );
        }
      };
      // update if changes mave been made
      if (itemsChanged || titleChanged) {
        makeChanges().then(() => toast.success("Project saved"));
      }
    } else {
      // create new project
      dispatch(
        createProjectAction({
          title: currentTitle || "",
          items: items.map((item) => item.content),
          uid: user.uid,
        })
      )
        .then((response) => {
          const projectId = unwrapResult(response).projectId;
          router.push(`/project?id=${projectId}`);
        })
        .then(() => toast.success("Project created"))
        .catch(() => {
          toast.error("Failed to create project");
        });
    }
  };

  return (
    <a data-tooltip-id="save" data-tooltip-content="Save project">
      <button
        onClick={handleSaveProject}
        className="hover:text-white text-green-500 hover:bg-green-500 p-2 hover:shadow-md rounded"
      >
        <MdSave size={24} />
      </button>
      <Tooltip id="save" place="bottom" />
    </a>
  );
}
