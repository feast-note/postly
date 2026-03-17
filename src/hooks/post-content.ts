"use client";
import { useCallback } from "react";
import { useLocalStorage } from "./localstorage";

export const usePostContent = (id: string) => {
  const { storedValue, setValue } =
    useLocalStorage<Record<string, string>>("post-content");
  const storeContent = storedValue?.[id] ?? null;

  const setLocalStorage = useCallback(
    (content: string) => {
      setValue((prev) => {
        const next = { ...prev, [id]: content };
        return next;
      });
    },
    [id, setValue],
  );

  return { state: storeContent, setLocalStorage };
};
