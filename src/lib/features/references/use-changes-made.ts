"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { selectItems } from "./reference-slice";
import { itemsEqual, transformItemsToStrings } from "./utils";

export function useChangesMade() {
  const projectId = useSelector(
    (state: RootState) => state.references.projectId
  );
  const currentTitle = useSelector(
    (state: RootState) => state.references.title
  );
  const projects = useSelector((state: RootState) => state.projects.projects);
  const items = useSelector(selectItems);
  const [initialItems, setInitialItems] = useState([] as string[]);
  const [initialTitle, setInitialTitle] = useState("");
  const [itemsChanged, setItemsChanged] = useState(false);
  const [titleChanged, setTitleChanged] = useState(false);
  const loading = useSelector((state: RootState) => state.projects.loading);

  useEffect(() => {
    if (projectId) {
      const currentProject = projects.find(
        (project) => project.id === projectId
      );
      setInitialItems(currentProject?.items! || []);
      setInitialTitle(currentProject?.title! || "");
    }
  }, [projects, projectId]);

  useEffect(() => {
    const itemsChanged = !itemsEqual(
      transformItemsToStrings(items),
      initialItems
    );
    const titleChanged = currentTitle !== initialTitle;
    // set false if loading
    setItemsChanged(loading ? false : itemsChanged);
    setTitleChanged(loading ? false : titleChanged);
  }, [items, currentTitle, initialItems, initialTitle, loading, projectId]);

  return {
    itemsChanged,
    titleChanged,
    initialItems,
    initialTitle,
  };
}
