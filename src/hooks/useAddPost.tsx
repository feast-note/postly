"use client";

import { useRef, useState } from "react";

export const useAddPost = () => {
  const [isAddMode, setIsAddMode] = useState(false);
  const onAddMode = (v: boolean) => setIsAddMode(v);

  const target = useRef<HTMLDivElement>(null);
  const getAddModeBounding = () => target.current?.getBoundingClientRect();

  return { target, getAddModeBounding, onAddMode, isAddMode };
};
