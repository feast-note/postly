"use client";

import { useRef } from "react";

export const usePostDrag = () => {
  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    postLeft: 0, // 노트 원래 위치 (CSS left)
    postTop: 0, // 노트 원래 위치 (CSS top)
  });

  const post = {
    init: (e: React.MouseEvent) => (position: { x: number; y: number }) => {
      dragStart.current.mouseX = e.clientX;
      dragStart.current.mouseY = e.clientY;
      dragStart.current.postLeft = position.x;
      dragStart.current.postTop = position.y;
    },
    move: (e: React.MouseEvent) => (scale: number) => {
      const deltaX = e.clientX - dragStart.current.mouseX;
      const deltaY = e.clientY - dragStart.current.mouseY;

      const realMoveX = deltaX / scale;
      const realMoveY = deltaY / scale;

      return {
        x: dragStart.current.postLeft + realMoveX,
        y: dragStart.current.postTop + realMoveY,
      };
    },
  };

  return { post };
};
