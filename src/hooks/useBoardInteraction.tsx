"use client";

import { Post } from "@/model/post";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import { usePostcardInteraction } from "./usePostcardInteraction";

export type Drag = "NONE" | "CANVAS" | "POST" | "CREATE";

export const useBoadInteraction = (
  posTools: {
    position: { x: number; y: number };
    onPosition: (x: number, y: number) => void;
  },
  scale: number,
  onCreated?: (post: Post) => void,
) => {
  const { position, onPosition } = posTools;
  const [selected, setSelected] = useState<string | null>(null);
  const onSelect = (id: string | null) => setSelected(id);

  const target = useRef<HTMLDivElement>(null);

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
      if (target.current === null) return;

      target.current.style.left = e.clientX + "px";
      target.current.style.top = e.clientY + "px";
      target.current.style.width = "0px";
      target.current.style.height = "0px";
      target.current.style.border = "2px solid red";
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
        if (!target.current) return;
        const { left, top } = target.current.getBoundingClientRect();

        target.current.style.width = e.clientX - left + "px";
        target.current.style.height = e.clientY - top + "px";
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
      if (!target.current) return;
      const { left, top } = target.current.getBoundingClientRect();

      target.current.style.width = e.clientX - left + "px";
      target.current.style.height = e.clientY - top + "px";

      const { width, height } = target.current.getBoundingClientRect() ?? {};

      createPost = {
        id: uuidv4(),
        color: "red",
        zIndex: 3,
        width: width / scale,
        height: height / scale,
        position: { x: left, y: top },
      };
      onCreated?.(createPost);
    }
    dragMode.current = "NONE";
  };

  const onDragMode = (v: Drag) => (dragMode.current = v);

  return {
    selected,
    refRegister: postApi.register,
    addModeRef: target,
    handlers: {
      onMouseDown: onCanvasMouseDown,
      onMouseMove,
      onClick: onOutlineClick,
      onMouseUp: onStop,
      onMouseLeave: onStop,
    },
    onDragMode,
    onPostMouseDown,
    onStop,
  };
};
