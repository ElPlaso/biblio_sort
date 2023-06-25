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
