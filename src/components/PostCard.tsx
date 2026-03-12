"use client";
import { forwardRef, useImperativeHandle } from "react";
import { LocalPost, Post } from "@/model/post";
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

  const { targetRef, handleResizeStart } = useResize(id);

  const { selected } = useSelect();
  const isSelected = id === selected;

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
      className={getBasicStyle(isSelected)}
      style={getPostCardStyle(postState?.[id], isSelected)}
      ref={targetRef}
      onMouseDown={onMouseDown}
    >
      <div className="flex flex-col flex-1 relative">
        <PostControls id={id} post={postState?.[id]} />
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

function getPostCardStyle(post?: LocalPost, isSelected: boolean = false) {
  const { position, color, size } = post ?? {};
  const { x, y } = position ?? {};
  const { width, height } = size ?? {};

  return {
    left: `${x ?? 0}px`,
    top: `${y ?? 0}px`,
    background: color || "#FFDE21",
    width: `${width ?? 360}px`,
    height: `${height ?? 360}px`,
    zIndex: `${isSelected ? "2" : "1"}`,
  };
}
