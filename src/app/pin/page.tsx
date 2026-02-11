"use client";

import Canvas from "@/components/Canvas";
import PostCard, { PostCardRef } from "@/components/PostCard";
import PostSetting from "@/components/PostSetting";
import { useDraggable } from "@/hooks/useDraggable";
import { useRef, useState } from "react";

export default function PinPage() {
  const [posts, setPosts] = useState<
    Array<{ id: string; title?: string; content?: string; zIndex: number }>
  >([
    {
      id: "0",
      title: "Zoom Test",
      content: "확대해도 잘 움직이나요?",
      zIndex: 1,
    },
    {
      id: "1",
      title: "배가 고픈가",
      content: "재료는 파가 없어...",
      zIndex: 0,
    },
  ]);

  const [selected, setSelected] = useState<string | null>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 }); // 캔버스 위치
  const [scale, setScale] = useState(1); // 확대 배율

  const { initCanvasPosition, initPostPosition, stopDrag, calculateDragMove } =
    useDraggable(scale);

  const postsRef = useRef<Map<string, PostCardRef>>(new Map());

  const onZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDirection = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(scale + zoomDirection, 0.1), 5);
    setScale(newScale);
  };

  const onCanvasMouseDown = (e: React.MouseEvent) =>
    initCanvasPosition(e, position);

  const onPostMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const target = postsRef.current.get(id);
    if (!target) return;

    const currentPostPosition = target.getInitialPosition(e);

    setSelected(id);
    initPostPosition(e, id, currentPostPosition);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const movement = calculateDragMove(e);
    if (!movement) return;
    const { type, x, y } = movement;

    // A. 캔버스 이동 (Pan)
    if (type === "CANVAS") {
      setPosition({
        x,
        y,
      });
    }

    // B. 노트 이동 (Move Note)
    if (type === "POST") {
      const target = postsRef.current.get((e.target as HTMLElement).id);
      if (!target) return;

      target.setPosition(x, y);
    }
  };

  const onOutlineClick = (e: React.MouseEvent) => {
    const target = postsRef.current.get((e.target as HTMLElement).id);
    if (selected && !target) {
      setSelected(null);
    }
  };

  return (
    <section
      className="w-screen h-[95vh] overflow-hidden bg-[#333]"
      onWheel={onZoom}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onClick={onOutlineClick}
    >
      <PostSetting />
      <Canvas position={{ x: position.x, y: position.y }} scale={scale}>
        {posts.map((post) => (
          <PostCard
            {...post}
            key={post.id}
            ref={(el) => {
              if (el) postsRef.current.set(post.id, el);
            }}
            selected={post.id === selected ? true : false}
            onMouseDown={(e) => onPostMouseDown(e, post.id)}
          />
        ))}
      </Canvas>
    </section>
  );
}
