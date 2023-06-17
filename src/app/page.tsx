"use client";

import ReferenceSorter from "./components/reference-sorter";
import { setProject } from "./features/references/reference-slice";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  dispatch(setProject(null as any));

  return <ReferenceSorter />;
}
