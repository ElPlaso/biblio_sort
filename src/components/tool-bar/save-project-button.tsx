import {
  createProjectAction,
  updateProjectItemsAction,
  updateProjectTitleAction,
} from "@/lib/features/projects/project-slice";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import { MdSave } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import toast from "react-hot-toast";
import { unwrapResult } from "@reduxjs/toolkit";
import { selectItems } from "@/lib/features/references/reference-slice";
import { transformItemsToStrings } from "@/lib/features/references/utils";
import { useChangesMade } from "@/lib/features/references/use-changes-made";

export default function SaveProjectButton(props: { disabled: boolean }) {
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

  const { itemsChanged, titleChanged } = useChangesMade();

  const handleSaveProject = async () => {
    if (!user) {
      toast("Please sign in to create a project");
      return;
    }
    if (projectId) {
      // update existing project
      const makeChanges = async () => {
        if (itemsChanged) {
          await dispatch(
            updateProjectItemsAction({
              projectId: projectId,
              items: transformItemsToStrings(items),
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
        className="enabled:hover:text-white text-green-500 enabled:hover:bg-green-500 p-2 enabled:hover:shadow-md rounded disabled:opacity-50"
        disabled={props.disabled}
      >
        <MdSave size={24} />
      </button>
      <Tooltip id="save" place="bottom" />
    </a>
  );
}
