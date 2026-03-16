"use client";
import { forwardRef, useMemo } from "react";
import { LocalPost, Post } from "@/model/post";
import PostContentForm from "./PostContentForm";
import PostControls from "./PostControls";
import { useSelect } from "@/context/SelectContext";
import { useResize } from "@/hooks/useResize";
import Resizer from "./Resizer";

type Props = {
  onMouseDown: (
    id: string,
    x: number,
    y: number,
  ) => (e: React.MouseEvent) => void;
  state?: LocalPost;
} & Post;

const PostCard = forwardRef<HTMLElement, Props>(function PostCard({
  onMouseDown,
  state,
  ...props
}: Props) {
  const { id, content } = props;

  const { targetRef, handleResizeStart } = useResize(id);

  const { selected } = useSelect();

  const {
    position: { x, y } = { x: 0, y: 0 },
    color = "#FFDE21",
    size: { width, height } = { width: 360, height: 360 },
  } = state ?? {};

  const baseStyle = useMemo(
    () => ({
      "--post-w": `${width}px`,
      "--post-h": `${height}px`,
      left: "0px",
      top: "0px",
      transform: `translate(${x}px,${y}px)`,
      backgroundColor: color,
    }),
    [color, height, width, x, y],
  );

  return (
    <article
      id={id}
      className={`post ${getBasicStyle()} w-(--post-w) h-(--post-h) ${id === selected ? "z-2 outline-2 outline-blue-700" : "z-1"}`}
      style={baseStyle}
      ref={targetRef}
      onMouseDown={(e) => onMouseDown(id, x ?? 0, y ?? 0)(e)}
    >
      <div className="flex flex-col flex-1 relative">
        <PostControls id={id} post={state} />
        <PostContentForm id={id} content={content} />

        {selected && <Resizer onResize={handleResizeStart} />}
      </div>
    </article>
  );
});

export default PostCard;

function getBasicStyle() {
  return `flex flex-col absolute cursor-grabbing shadow-lg`;
}
