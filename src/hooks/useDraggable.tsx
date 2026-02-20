"use client";

import { useRef } from "react";

export const useDraggable = (scale: number) => {
  const dragMode = useRef<"NONE" | "CANVAS" | "POST">("NONE");

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    canvasX: 0, // 캔버스 원래 위치
    canvasY: 0,
    postId: "-1", // 드래그 중인 노트 ID
    postLeft: 0, // 노트 원래 위치 (CSS left)
    postTop: 0, // 노트 원래 위치 (CSS top)
  });

  const initCanvasPosition = (
    e: React.MouseEvent,
    currentCanvasPosition: { x: number; y: number },
  ) => {
    dragMode.current = "CANVAS";
    dragStart.current.mouseX = e.clientX;
    dragStart.current.mouseY = e.clientY;
    dragStart.current.canvasX = currentCanvasPosition.x;
    dragStart.current.canvasY = currentCanvasPosition.y;
  };

  const initPostPosition = (
    e: React.MouseEvent,
    id: string,
    currentPostPosition: {
      offsetLeft: number;
      offsetTop: number;
    },
  ) => {
    dragMode.current = "POST";
    dragStart.current.postId = id;

    const { offsetLeft, offsetTop } = currentPostPosition;

    dragStart.current.mouseX = e.clientX;
    dragStart.current.mouseY = e.clientY;

    dragStart.current.postLeft = offsetLeft;
    dragStart.current.postTop = offsetTop;
  };

  const calculateDragMove = (e: React.MouseEvent) => {
    switch (dragMode.current) {
      case "NONE":
        return null;
      case "CANVAS": {
        const deltaX = e.clientX - dragStart.current.mouseX;
        const deltaY = e.clientY - dragStart.current.mouseY;

        return {
          type: "CANVAS",
          x: dragStart.current.canvasX + deltaX,
          y: dragStart.current.canvasY + deltaY,
        };
      }
      case "POST": {
        const deltaX = e.clientX - dragStart.current.mouseX;
        const deltaY = e.clientY - dragStart.current.mouseY;

        const realMoveX = deltaX / scale;
        const realMoveY = deltaY / scale;

        return {
          type: "POST",
          x: dragStart.current.postLeft + realMoveX,
          y: dragStart.current.postTop + realMoveY,
        };
      }
    }
  };

  const stopDrag = () => (dragMode.current = "NONE");

  return { initCanvasPosition, initPostPosition, calculateDragMove, stopDrag };
};
