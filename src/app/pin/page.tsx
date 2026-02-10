"use client";

import Canvas from "@/components/Canvas";
import PostCard from "@/components/PostCard";
import PostSetting from "@/components/PostSetting";
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

  const [position, setPosition] = useState({ x: 0, y: 0 }); // 캔버스 위치
  const [scale, setScale] = useState(1); // 확대 배율

  const dragMode = useRef<"NONE" | "CANVAS" | "NOTE">("NONE");

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    canvasX: 0, // 캔버스 원래 위치
    canvasY: 0,
    noteId: -1, // 드래그 중인 노트 ID
    noteLeft: 0, // 노트 원래 위치 (CSS left)
    noteTop: 0, // 노트 원래 위치 (CSS top)
  });

  const postsRef = useRef<Map<number, HTMLElement>>(new Map());

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDirection = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(scale + zoomDirection, 0.1), 5);
    setScale(newScale);
  };

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    // 배경을 눌렀을 때만 캔버스 이동 모드
    dragMode.current = "CANVAS";
    dragStart.current.mouseX = e.clientX;
    dragStart.current.mouseY = e.clientY;
    dragStart.current.canvasX = position.x;
    dragStart.current.canvasY = position.y;
  };

  const handleMouseDownNote = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    const target = postsRef.current.get(id);
    if (!target) return;

    dragMode.current = "NOTE";
    dragStart.current.noteId = id;

    // 마우스 시작 위치
    dragStart.current.mouseX = e.clientX;
    dragStart.current.mouseY = e.clientY;

    dragStart.current.noteLeft = target.offsetLeft;
    dragStart.current.noteTop = target.offsetTop;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragMode.current === "NONE") return;

    // A. 캔버스 이동 (Pan)
    if (dragMode.current === "CANVAS") {
      const deltaX = e.clientX - dragStart.current.mouseX;
      const deltaY = e.clientY - dragStart.current.mouseY;

      setPosition({
        x: dragStart.current.canvasX + deltaX,
        y: dragStart.current.canvasY + deltaY,
      });
    }

    // B. 노트 이동 (Move Note)
    if (dragMode.current === "NOTE") {
      const target = postsRef.current.get(dragStart.current.noteId);
      if (!target) return;

      // 1. 마우스가 얼마나 움직였나?
      const deltaX = e.clientX - dragStart.current.mouseX;
      const deltaY = e.clientY - dragStart.current.mouseY;

      // 2. (움직인 거리) / 스케일
      const realMoveX = deltaX / scale;
      const realMoveY = deltaY / scale;

      // 3. 노트 위치 업데이트 (Ref를 통해 DOM 직접 수정 -> 성능 최적화)
      target.style.left = `${dragStart.current.noteLeft + realMoveX}px`;
      target.style.top = `${dragStart.current.noteTop + realMoveY}px`;
    }
  };

  const handleMouseUp = () => {
    dragMode.current = "NONE";
  };

  return (
    <section
      className="w-screen h-screen overflow-hidden bg-[#333]"
      onWheel={handleWheel}
      onMouseDown={handleMouseDownCanvas}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <PostSetting />
      <Canvas position={{ x: position.x, y: position.y }} scale={scale}>
        {posts.map((post) => (
          <PostCard
            {...post}
            key={post.id}
            targetRef={(el) => {
              if (el) postsRef.current.set(Number(post.id), el);
            }}
            handleMouseDown={(e) => handleMouseDownNote(e, Number(post.id))}
          />
        ))}
      </Canvas>
    </section>
  );
}
