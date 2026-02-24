"use client";

import { Post } from "@/model/post";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import { usePostcardInteraction } from "./usePostcardInteraction";
import { useTransform } from "@/context/TransformContext";
import { useAddMode } from "@/context/AddModeContext";

export type Drag = "NONE" | "CANVAS" | "POST" | "CREATE";

export const useBoadInteraction = (onCreated?: (post: Post) => void) => {
  const { scale, onScale, position, onPosition } = useTransform();

  const { addActions } = useAddMode();

  const [selected, setSelected] = useState<string | null>(null);
  const onSelect = (id: string | null) => setSelected(id);

  const { postApi } = usePostcardInteraction();

  const dragMode = useRef<Drag>("NONE");
  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    canvasX: 0,
    canvasY: 0,
    postLeft: 0, // 노트 원래 위치 (CSS left)
    postTop: 0, // 노트 원래 위치 (CSS top)
  });

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (dragMode.current === "CREATE") {
      addActions.init(e);
    } else {
      dragMode.current = "CANVAS";
      dragStart.current.mouseX = e.clientX;
      dragStart.current.mouseY = e.clientY;
      dragStart.current.canvasX = position.x;
      dragStart.current.canvasY = position.y;
    }
  };

  const onPostMouseDown = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();

    dragMode.current = "POST";

    const { offsetLeft, offsetTop } = postApi.init(e)(id) ?? {};

    dragStart.current.mouseX = e.clientX;
    dragStart.current.mouseY = e.clientY;
    dragStart.current.postLeft = offsetLeft ?? 0;
    dragStart.current.postTop = offsetTop ?? 0;
    onSelect(id);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const type = dragMode.current;
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

          postApi.move(
            dragStart.current.postLeft + realMoveX,
            dragStart.current.postTop + realMoveY,
          )(selected);
        }
        break;
      case "CREATE": {
        addActions.move(e);
        break;
      }
    }
  };

  const onOutlineClick = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    onSelect(el?.id ?? el?.parentElement?.id ?? null);
  };

  const onStop = (e: React.MouseEvent) => {
    let createPost: Post | null = null;
    const type = dragMode.current;

    if (type === "POST" && selected) {
      const deltaX = e.clientX - dragStart.current.mouseX;
      const deltaY = e.clientY - dragStart.current.mouseY;

      const realMoveX = deltaX / scale;
      const realMoveY = deltaY / scale;

      postApi.move(
        dragStart.current.postLeft + realMoveX,
        dragStart.current.postTop + realMoveY,
      )(selected);
    }

    if (type === "CREATE") {
      addActions.move(e);

      const { width, height, left, top } = addActions?.getBounding() ?? {};

      createPost = {
        id: uuidv4(),
        color: "red",
        zIndex: 3,
        width: (width ?? 0) / scale,
        height: (height ?? 0) / scale,
        position: { x: left ?? 0, y: top ?? 0 },
      };
      onCreated?.(createPost);
    }
    dragMode.current = "NONE";
  };

  const onDragMode = (v: Drag) => (dragMode.current = v);

  return {
    selected,
    refRegister: postApi.register,
    handlers: {
      onMouseDown: onCanvasMouseDown,
      onMouseMove,
      onClick: onOutlineClick,
      onMouseUp: onStop,
      onMouseLeave: onStop,
      onwheel: onScale,
    },
    onDragMode,
    onPostMouseDown,
    onStop,
  };
};
