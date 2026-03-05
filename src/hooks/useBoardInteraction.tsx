"use client";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { usePostcardInteraction } from "./usePostcardInteraction";
import { useTransform } from "@/context/TransformContext";
import { useAddMode } from "@/context/AddModeContext";
import { useDragMode } from "@/context/DragModeContext";
import { usePostData } from "./usePostData";

export type Drag = "NONE" | "CANVAS" | "POST" | "CREATE";

export const useBoadInteraction = () => {
  const { scale, onScale, position, onPosition } = useTransform();

  const { addActions, onAddMode } = useAddMode();

  const { postRef } = usePostcardInteraction();

  const { dragMode, onDragMode, onSelect, selected } = useDragMode();

  const { addPostItem } = usePostData();

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    canvasX: 0,
    canvasY: 0,
    postLeft: 0, // 노트 원래 위치 (CSS left)
    postTop: 0, // 노트 원래 위치 (CSS top)
  });

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (dragMode() === "CREATE") {
      dragStart.current.mouseX = e.clientX;
      dragStart.current.mouseY = e.clientY;
      dragStart.current.canvasX = position.x;
      dragStart.current.canvasY = position.y;
      addActions.init(e, position, scale);
    } else {
      onDragMode("CANVAS");
      dragStart.current.mouseX = e.clientX;
      dragStart.current.mouseY = e.clientY;
      dragStart.current.canvasX = position.x;
      dragStart.current.canvasY = position.y;
    }
  };

  const onPostMouseDown = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();

    onDragMode("POST");

    const { offsetLeft, offsetTop } = postRef.init(e)(id) ?? {};

    dragStart.current.mouseX = e.clientX;
    dragStart.current.mouseY = e.clientY;
    dragStart.current.postLeft = offsetLeft ?? 0;
    dragStart.current.postTop = offsetTop ?? 0;

    onSelect(id);
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
      case "CREATE": {
        addActions.move(e, position, scale);
        break;
      }
      case "NONE":
        break;
      default:
        throw new Error(`Unsupported drag mode : ${type}`);
    }
  };

  const onOutlineClick = (e: React.MouseEvent) => {
    const type = dragMode();

    switch (type) {
      case "POST": {
        if (!selected) {
          const el = e.target as HTMLElement;
          onSelect(el?.id ?? el?.parentElement?.id);
        }
      }

      case "CANVAS":
        onSelect(null);
        break;
      case "CREATE":
        break;
      case "NONE":
        if (e.target === e.currentTarget) onSelect(null);
        onSelect(null);
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

    if (type === "CREATE") {
      addActions.move(e, position, scale);

      const { width, height, left, top } = addActions.getBounding() ?? {};

      const newPost = {
        color: "yellow",
        zIndex: 1,
        width: (width ?? 0) / scale,
        height: (height ?? 0) / scale,
        position: {
          x: (left ?? 0) / scale + position.x,
          y: (top ?? 0) / scale + position.y,
        },
      };
      if (!newPost) return;
      addPostItem.mutate(newPost);
      // onCreated?.(newPost);
      onAddMode(false);
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
    onStop,
  };
};
