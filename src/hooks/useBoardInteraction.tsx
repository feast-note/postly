"use client";

import { useRef } from "react";
import { usePostcardInteraction } from "./usePostcardInteraction";
import { useTransform } from "@/context/TransformContext";
import { useDragMode } from "@/hooks/useDragMode";
import { useSelect } from "@/context/SelectContext";

export type Drag = "NONE" | "CANVAS" | "POST";

export const useBoadInteraction = () => {
  const { scale, onScale, position, onPosition } = useTransform();

  const { postRef } = usePostcardInteraction();
  const { selected, onSelect } = useSelect();
  const { dragMode, onDragMode } = useDragMode();

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    canvasX: 0,
    canvasY: 0,
    postLeft: 0, // 노트 원래 위치 (CSS left)
    postTop: 0, // 노트 원래 위치 (CSS top)
  });

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (selected) onSelect(null);
    onDragMode("CANVAS");
    dragStart.current.mouseX = e.clientX;
    dragStart.current.mouseY = e.clientY;
    dragStart.current.canvasX = position.x;
    dragStart.current.canvasY = position.y;
  };

  const onPostMouseDown = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onDragMode("POST");

    onSelect(id);

    const { offsetLeft, offsetTop } = postRef.init(e)(id) ?? {};

    dragStart.current.mouseX = e.clientX;
    dragStart.current.mouseY = e.clientY;
    dragStart.current.postLeft = offsetLeft ?? 0;
    dragStart.current.postTop = offsetTop ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const type = dragMode();
    switch (type) {
      case "CANVAS":
        const deltaX = e.clientX - dragStart.current.mouseX;
        const deltaY = e.clientY - dragStart.current.mouseY;

        onPosition(
          dragStart.current.canvasX + deltaX,
          dragStart.current.canvasY + deltaY,
        );
        break;
      case "POST":
        if (selected) {
          const deltaX = e.clientX - dragStart.current.mouseX;
          const deltaY = e.clientY - dragStart.current.mouseY;

          const realMoveX = deltaX / scale;
          const realMoveY = deltaY / scale;

          postRef.move(
            dragStart.current.postLeft + realMoveX,
            dragStart.current.postTop + realMoveY,
          )(selected);
        }
        break;
      case "NONE":
        break;
      default:
        throw new Error(`Unsupported drag mode : ${type}`);
    }
  };

  const onOutlineClick = (e: React.MouseEvent) => {
    const type = dragMode();

    switch (type) {
      case "POST":
      case "CANVAS":
        onSelect(null);
        break;
      case "NONE":
        const el = e.target as HTMLElement;
        if (el.id === "canvas") {
          onSelect(null);
        }

        break;
      default:
        throw new Error(`Unsupported drag mode : ${type}`);
    }
  };

  const onStop = (e: React.MouseEvent) => {
    const type = dragMode();

    if (type === "POST" && selected) {
      const deltaX = e.clientX - dragStart.current.mouseX;
      const deltaY = e.clientY - dragStart.current.mouseY;

      const realMoveX = deltaX / scale;
      const realMoveY = deltaY / scale;

      postRef.move(
        dragStart.current.postLeft + realMoveX,
        dragStart.current.postTop + realMoveY,
      )(selected);
    }

    onDragMode("NONE");
  };

  return {
    refRegister: postRef.register,
    handlers: {
      onMouseDown: onCanvasMouseDown,
      onMouseMove,
      onClick: onOutlineClick,
      onMouseUp: onStop,
      onMouseLeave: onStop,
      onWheel: onScale,
    },
    onPostMouseDown,
  };
};
