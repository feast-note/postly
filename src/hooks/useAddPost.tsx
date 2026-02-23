"use client";

import { useState } from "react";

export const useAddPost = () => {
  const [isAddMode, setIsAddMode] = useState(false);
  const onAddMode = (v: boolean) => setIsAddMode(v);

  return { onAddMode, isAddMode };
};
