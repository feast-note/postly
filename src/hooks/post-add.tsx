"use client";

import { useRef, useState } from "react";

export const useAddPost = () => {
  const target = useRef<HTMLDivElement>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const onAddMode = (v: boolean) => setIsAddMode(v);

  return { onAddMode, isAddMode, target };
};
