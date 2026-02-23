"use client";

import { useRef } from "react";

export const useCanvasDrag = () => {
  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    canvasX: 0,
    canvasY: 0,
  });

  const canvas = {
    init: (e: React.MouseEvent) => (position: { x: number; y: number }) => {
      dragStart.current.mouseX = e.clientX;
      dragStart.current.mouseY = e.clientY;
      dragStart.current.canvasX = position.x;
      dragStart.current.canvasY = position.y;
    },
    move: (e: React.MouseEvent) => {
      const deltaX = e.clientX - dragStart.current.mouseX;
      const deltaY = e.clientY - dragStart.current.mouseY;

      return {
        x: dragStart.current.canvasX + deltaX,
        y: dragStart.current.canvasY + deltaY,
      };
    },
  };

  return { canvas };
};
