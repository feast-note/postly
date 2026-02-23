"use client";

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
import { useAddPost } from "@/hooks/useAddPost";
import { useCanvasDrag } from "@/hooks/useCanvasDrag";
import { usePostDrag } from "@/hooks/usePostDrag";
import { useCreatePost } from "@/hooks/useCreatePost";
import PostCards from "./PostCards";

export type Drag = "NONE" | "CANVAS" | "POST" | "CREATE";

export default function Board() {
  const { data: posts } = useQuery<Array<Post>>({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("/api/post")
        .then((res) => res.json())
        .catch((error) => error),
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const [newPosts, setNewPosts] = useState<Array<Post>>([]);
  const totalPosts = [...(posts || []), ...newPosts];

  const { target, getAddModeBounding, onAddMode, isAddMode } = useAddPost();

  const { position, onPosition } = usePosition();

  const { canvas } = useCanvasDrag();
  const { post } = usePostDrag();
  const { create } = useCreatePost(target);

  const { scale, onScale } = useScale();
  const dragMode = useRef<Drag>("NONE");

  const { selected, onSelect, postApi } = usePostcardInteraction();

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (dragMode.current === "CREATE") {
      create.init(e);
    } else {
      dragMode.current = "CANVAS";
      canvas.init(e)(position);
    }
  };

  const onPostMouseDown = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();

    dragMode.current = "POST";

    const { offsetLeft, offsetTop } = postApi.init(e)(id) ?? {};

    const currentPostPosition = {
      x: offsetLeft ?? 0,
      y: offsetTop ?? 0,
    };

    post.init(e)(currentPostPosition);
    onSelect(id);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const type = dragMode.current;

    if (type === "CANVAS") {
      const { x, y } = canvas.move(e);
      onPosition(x, y);
    }

    if (type === "POST" && selected) {
      const { x, y } = post.move(e)(scale);
      postApi.move(x, y)(selected);
    }

    if (type === "CREATE") create.move(e);
  };

  const onOutlineClick = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    onSelect(el?.id ?? el?.parentElement?.id ?? null);
  };

  const onStop = (e: React.MouseEvent) => {
    const type = dragMode.current;

    if (type === "POST" && selected) {
      const { x, y } = post.move(e)(scale);
      postApi.move(x, y)(selected);
    }

    if (type === "CREATE" && target.current) {
      create.move(e);

      const { left, top, width, height } = getAddModeBounding() ?? {};

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

  const onToggle = (v: boolean) => {
    onAddMode(v);
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
      <PostSetting selected={selected} />
      <ToolBar>
        <AddPost onToggle={onToggle} />
      </ToolBar>
      <Canvas position={position} scale={scale}>
        <PostCards
          posts={totalPosts}
          register={postApi.register}
          selected={selected}
          onMouseDown={onPostMouseDown}
        />
        {isAddMode && <div ref={target} className="absolute"></div>}
      </Canvas>
    </section>
  );
}
