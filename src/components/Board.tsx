"use client";

import { useDraggable } from "@/hooks/useDraggable";
import PostCard from "./PostCard";
import PostSetting from "./PostSetting";
import Canvas from "./Canvas";
import { Post } from "@/model/post";
import { useQuery } from "@tanstack/react-query";
import { useScale } from "@/hooks/useScale";
import { usePosition } from "@/hooks/usePosition";
import { usePostcardInteraction } from "@/hooks/usePostcardInteraction";
import ToolBar from "./ToolBar";
import { useRef, useState } from "react";
import AddPost from "./AddPost";

export type Drag = "NONE" | "CANVAS" | "POST" | "CREATE";

export default function Board() {
  const { data: posts } = useQuery<Array<Post>>({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("/api/post")
        .then((res) => res.json())
        .catch((error) => error),
    refetchOnWindowFocus: true,
  });

  const [newPosts, setNewPosts] = useState<Array<Post>>([]);
  const totalPosts = [...(posts || []), ...newPosts];

  const grabPostArea = useRef<HTMLDivElement>(null);

  const { position, onPosition } = usePosition();

  const { scale, onScale } = useScale();
  const dragMode = useRef<Drag>("NONE");

  const { initPosition, calculateDragMove } = useDraggable(scale);

  const { onRef, selected, onSelect, getSelectedRef } =
    usePostcardInteraction();

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (dragMode.current === "CREATE") {
      initPosition["CREATE"](e)(grabPostArea);
    } else {
      dragMode.current = "CANVAS";
      initPosition["CANVAS"](e)(position);
    }
  };

  const onPostMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    dragMode.current = "POST";

    const { offsetLeft, offsetTop } =
      getSelectedRef(id)?.getInitialPosition(e) ?? {};

    const currentPostPosition = {
      x: offsetLeft ?? 0,
      y: offsetTop ?? 0,
    };

    initPosition["POST"](e)(currentPostPosition);
    onSelect(id);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const type = dragMode.current;

    if (type === "CANVAS") {
      const { x, y } = calculateDragMove["CANVAS"](e);
      onPosition(x, y);
    }

    if (type === "POST" && selected) {
      const { x, y } = calculateDragMove["POST"](e);
      getSelectedRef(selected)?.setPosition(x, y);
    }

    if (type === "CREATE") calculateDragMove["CREATE"](e)(grabPostArea);
  };

  const onOutlineClick = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    onSelect(el?.id ?? el?.parentElement?.id ?? null);
  };

  const onStop = (e: React.MouseEvent) => {
    const type = dragMode.current;

    if (type === "POST" && selected) {
      const { x, y } = calculateDragMove["POST"](e);
      getSelectedRef(selected)?.setPosition(x, y);
    }

    if (type === "CREATE" && grabPostArea.current) {
      const { left, top, width, height } =
        grabPostArea.current.getBoundingClientRect();
      setNewPosts((prev) =>
        prev.concat([
          {
            id: String(newPosts.length - 1),
            color: "red",
            zIndex: 3,
            width,
            height,
            position: { x: left, y: top },
          },
        ]),
      );
      onToggle(false);
    }

    dragMode.current = "NONE";
  };

  const [isAddMode, setIsAddMode] = useState(false);
  const onToggle = (v: boolean) => {
    setIsAddMode(v);
    if (v) dragMode.current = "CREATE";
  };

  return (
    <section
      className={`w-screen h-full overflow-hidden bg-[#333] ${isAddMode ? "cursor-crosshair" : "cursor-default"}`}
      onWheel={onScale}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onStop}
      onMouseLeave={onStop}
      onClick={onOutlineClick}
    >
      <PostSetting selected={posts?.find((v) => v.id === selected) || null} />
      <ToolBar>
        <AddPost onToggle={onToggle} />
      </ToolBar>
      <Canvas position={position} scale={scale}>
        {totalPosts?.map((post) => (
          <PostCard
            {...post}
            key={post.id}
            ref={onRef(post.id)}
            selected={post.id === selected ? true : false}
            onMouseDown={(e) => onPostMouseDown(e, post.id)}
          />
        ))}
        {isAddMode && <div ref={grabPostArea} className="absolute"></div>}
      </Canvas>
    </section>
  );
}
