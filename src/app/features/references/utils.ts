import { SortableItem } from "@/app/types/sortable-item";
import { uid } from "uid";

// transforms an array of items into an array of strings
export function transformItemsToStrings(items: SortableItem[]) {
  return items.map((item) => item.content);
}

// transforms an array of strings into an array of sortable items
export function transformItems(items: string[]): SortableItem[] {
  return items.map((item) => {
    return {
      id: uid(),
      content: item,
    };
  });
}

// used for checking if items have been modified
export function itemsEqual(items1: string[], items2: string[]) {
  if (items1 === items2) return true;
  if (items1 == null || items2 == null) return false;
  if (items1.length !== items2.length) return false;
  for (var i = 0; i < items1.length; ++i) {
    if (items1[i] !== items2[i]) return false;
  }
  return true;
}

// automatically generating citation from url

import Parser from "@postlight/parser";

export async function generateCitation(url: string) {
  const result = await Parser.parse(url);

  const title = result.title;
  const author = result.author;
  const date = result.date_published
    ? new Date(result.date_published).getFullYear()
    : null;

  // IEEE citation format:
  // [1] A. A. Author, "Title of document," Site Name, year. [Online]. Available: URL.
  // [Accessed: Day- Month- Year].
  // ommit any value if not available

  let citation = `${author ? `${author}, ` : ""}${title ? `"${title}", ` : ""}`;

  // append if not empty
  citation += date ? `${date}. ` : "";

  citation += url ? `[Online]. Available: ${url}. ` : "";
  citation += `[Accessed: ${new Date().toLocaleDateString("en-GB")}]`;

  return citation;
}
