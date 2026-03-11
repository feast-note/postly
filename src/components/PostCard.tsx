"use client";
import { forwardRef, useImperativeHandle } from "react";
import { BoardPost, Post } from "@/model/post";
import { usePost } from "@/context/PostContext";
import PostContentForm from "./PostContentForm";
import PostControls from "./PostControls";
import { useSelect } from "@/context/SelectContext";
import { useResize } from "@/hooks/useResize";
import Resizer from "./Resizer";

type Props = {
  onMouseDown: (e: React.MouseEvent<Element, MouseEvent>) => void;
} & Post;

export type PostCardRef = {
  node: HTMLElement | null;
  getInitialPosition: (e: React.MouseEvent<Element, MouseEvent>) =>
    | {
        offsetLeft: number;
        offsetTop: number;
      }
    | undefined;
  setPosition: (x: number, y: number) => void;
};

const PostCard = forwardRef<PostCardRef, Props>(function PostCard(
  { onMouseDown, ...props }: Props,
  ref,
) {
  const { id, content } = props;

  const { updatePosition, postState } = usePost();
  const { position, size, color } = postState?.[id] ?? {};

  const { targetRef, handleResizeStart } = useResize(id);

  const { selected } = useSelect();

  useImperativeHandle(ref, () => {
    return {
      getInitialPosition(e: React.MouseEvent<Element, MouseEvent>) {
        e.stopPropagation();

        const el = targetRef.current as unknown as HTMLElement;

        return {
          offsetLeft: el.offsetLeft,
          offsetTop: el.offsetTop,
        };
      },
      setPosition(x: number, y: number) {
        const el = targetRef.current as unknown as HTMLElement;
        el.style.left = x + "px";
        el.style.top = y + "px";
        updatePosition(id, x, y);
      },
      node: targetRef.current,
    };
  }, [id, targetRef, updatePosition]);

  return (
    <article
      id={id}
      className={getBasicStyle(id === selected)}
      style={getPostCardStyle({ ...props, position, color, ...size })}
      ref={targetRef}
      onMouseDown={onMouseDown}
    >
      <div className="flex flex-col flex-1 relative">
        <PostControls post={{ ...props, color }} />
        <PostContentForm id={id} content={content} />

        {selected && <Resizer onResize={handleResizeStart} />}
      </div>
    </article>
  );
});

export default PostCard;

function getBasicStyle(selected: boolean) {
  const selectStyle = selected ? "outline-2 outline-blue-700" : "";

  return `flex flex-col absolute cursor-grabbing shadow-lg ${selectStyle}`;
}

function getPostCardStyle(
  post: Partial<
    Pick<BoardPost, "color" | "position" | "zIndex" | "width" | "height">
  >,
) {
  const { position, color, width, height, zIndex } = post ?? {};

  return {
    left: `${position?.x ?? 0}px`,
    top: `${position?.y ?? 0}px`,
    background: color || "#FFDE21",
    width: `${width ?? 360}px`,
    height: `${height ?? 360}px`,
    zIndex,
  };
}
