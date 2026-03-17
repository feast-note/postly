"use client";

import { RefObject, useRef } from "react";

export const useDraggable = (scale: number) => {
  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    canvasX: 0, // 캔버스 원래 위치
    canvasY: 0,
    postId: "-1", // 드래그 중인 노트 ID
    postLeft: 0, // 노트 원래 위치 (CSS left)
    postTop: 0, // 노트 원래 위치 (CSS top)
  });

  const initPosition = {
    CANVAS: (e: React.MouseEvent) => (position: { x: number; y: number }) => {
      dragStart.current.mouseX = e.clientX;
      dragStart.current.mouseY = e.clientY;
      dragStart.current.canvasX = position.x;
      dragStart.current.canvasY = position.y;
    },
    POST: (e: React.MouseEvent) => (position: { x: number; y: number }) => {
      dragStart.current.mouseX = e.clientX;
      dragStart.current.mouseY = e.clientY;
      dragStart.current.postLeft = position.x;
      dragStart.current.postTop = position.y;
    },
    CREATE: (e: React.MouseEvent) => (el: RefObject<HTMLDivElement | null>) => {
      if (!el.current) return;
      el.current.style.left = e.clientX + "px";
      el.current.style.top = e.clientY + "px";
      el.current.style.width = "0px";
      el.current.style.height = "0px";
      el.current.style.border = "2px solid red";
    },
  };

  const calculateDragMove = {
    CANVAS: (e: React.MouseEvent) => {
      const deltaX = e.clientX - dragStart.current.mouseX;
      const deltaY = e.clientY - dragStart.current.mouseY;

      return {
        x: dragStart.current.canvasX + deltaX,
        y: dragStart.current.canvasY + deltaY,
      };
    },
    POST: (e: React.MouseEvent) => {
      const deltaX = e.clientX - dragStart.current.mouseX;
      const deltaY = e.clientY - dragStart.current.mouseY;

      const realMoveX = deltaX / scale;
      const realMoveY = deltaY / scale;

      return {
        x: dragStart.current.postLeft + realMoveX,
        y: dragStart.current.postTop + realMoveY,
      };
    },
    CREATE: (e: React.MouseEvent) => (el: RefObject<HTMLDivElement | null>) => {
      if (!el.current) return;
      const { left, top } = el.current.getBoundingClientRect();

      el.current.style.width = e.clientX - left + "px";
      el.current.style.height = e.clientY - top + "px";
    },
  };

  return {
    calculateDragMove,
    initPosition,
  };
};
