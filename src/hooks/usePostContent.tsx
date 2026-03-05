"use client";
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

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

  const delLocalStorage = useCallback(() => {
    setValue((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, [id, setValue]);

  return { state: storeContent, setLocalStorage, delLocalStorage };
};
