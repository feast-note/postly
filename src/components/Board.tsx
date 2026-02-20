"use client";

import { useDraggable } from "@/hooks/useDraggable";
import PostCard from "./PostCard";
import PostSetting from "./PostSetting";
import Canvas from "./Canvas";
import { MdKeyboardArrowDown, MdOutlinePostAdd } from "react-icons/md";
import { RxGroup } from "react-icons/rx";
import { Post } from "@/model/post";
import { useQuery } from "@tanstack/react-query";
import { useScale } from "@/hooks/useScale";
import { usePosition } from "@/hooks/usePosition";
import { usePostcardInteraction } from "@/hooks/usePostcardInteraction";

export default function Board() {
  const { data: posts } = useQuery<Array<Post>>({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("/api/post")
        .then((res) => res.json())
        .catch((error) => error),
    refetchOnWindowFocus: true,
  });

  const { position, onPosition } = usePosition();

  const { scale, onScale } = useScale();
  const { initCanvasPosition, initPostPosition, stopDrag, calculateDragMove } =
    useDraggable(scale);

  const { onRef, selected, onSelect, getSelectedRef } =
    usePostcardInteraction();

  const onCanvasMouseDown = (e: React.MouseEvent) =>
    initCanvasPosition(e, position);

  const onPostMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    const currentPostPosition = getSelectedRef(id)?.getInitialPosition(e) ?? {
      offsetLeft: 0,
      offsetTop: 0,
    };

    initPostPosition(e, id, currentPostPosition);
    onSelect(id);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const movement = calculateDragMove(e);

    const { type, x, y } = movement ?? {};

    // A. 캔버스 이동 (Pan)
    if (type === "CANVAS") onPosition(x ?? 0, y ?? 0);

    // B. 노트 이동 (Move Note)
    if (type === "POST" && selected) {
      getSelectedRef(selected)?.setPosition(x ?? 0, y ?? 0);
    }
  };

  const onOutlineClick = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    onSelect(el?.id ?? el?.parentElement?.id ?? null);
  };

  const onStop = (e: React.MouseEvent) => {
    const movement = calculateDragMove(e);
    const { type, x, y } = movement ?? {};

    if (type === "POST" && selected) {
      getSelectedRef(selected)?.setPosition(x ?? 0, y ?? 0);
    }

    stopDrag();
  };

  return (
    <section
      className="w-screen h-full overflow-hidden bg-[#333]"
      onWheel={onScale}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onStop}
      onMouseLeave={onStop}
      onClick={onOutlineClick}
    >
      <PostSetting selected={posts?.find((v) => v.id === selected) || null} />
      <menu className="absolute bottom-2 left-[48%] bg-slate-900 p-2 rounded-md z-100 flex gap-3">
        <li>
          <button className="flex items-center text-gray-300 border-[0.1px] p-1 rounded-sm border-gray-300 hover:bg-neutral-950">
            <span>
              <MdOutlinePostAdd size={17} />
            </span>
            <span>
              <MdKeyboardArrowDown size={15} />
            </span>
          </button>
        </li>
        <li>
          <button className="flex items-center text-gray-300 border-[0.1px] p-1 rounded-sm border-gray-300 hover:bg-neutral-950">
            <RxGroup />
          </button>
        </li>
      </menu>
      <Canvas position={{ x: position.x, y: position.y }} scale={scale}>
        {posts?.map((post) => (
          <PostCard
            {...post}
            key={post.id}
            ref={onRef(post.id)}
            selected={post.id === selected ? true : false}
            onMouseDown={(e) => onPostMouseDown(e, post.id)}
          />
        ))}
      </Canvas>
    </section>
  );
}
