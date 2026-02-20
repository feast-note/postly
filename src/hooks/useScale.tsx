"use client";

import { useState } from "react";

export const useScale = () => {
  const [scale, setScale] = useState(1);

  const onScale = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDirection = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(scale + zoomDirection, 0.1), 5);
    setScale(newScale);
  };

  return { scale, onScale };
};
