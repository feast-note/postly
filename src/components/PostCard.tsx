"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import Img from "./Img";
import { BoardPost } from "@/model/post";
import { usePostPosition } from "@/context/PositionContext";
import PostContentForm from "./PostContentForm";
import PostControls from "./PostControls";

type Props = {
  onMouseDown: (e: React.MouseEvent<Element, MouseEvent>) => void;
  selected?: boolean;
} & BoardPost;

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
  { position, selected = false, onMouseDown, ...props }: Props,
  ref,
) {
  const { id, width, height, content, color, zIndex, image } = props;
  const targetRef = useRef<HTMLElement>(null);
  const { updatePosition } = usePostPosition();

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
  }, [id, updatePosition]);

  return (
    <article
      id={id}
      className={getBasicStyle(selected)}
      style={getPostCardStyle({
        position,
        color,
        width,
        height,
        zIndex,
      })}
      ref={targetRef}
      onMouseDown={onMouseDown}
    >
      <PostControls post={props} />
      <div className="p-2 flex-1 flex flex-col">
        {image && <Img image={image} />}
        <PostContentForm id={id} content={content} />
      </div>
    </article>
  );
});

export default PostCard;

function getBasicStyle(selected: boolean) {
  const selectStyle = selected ? "outline-2 outline-blue-700" : "";

  return `flex flex-col rounded-md absolute shadow-lg cursor-grab active:cursor-grabbing ${selectStyle} group`;
}

function getPostCardStyle({
  position,
  color,
  width,
  height,
  zIndex,
}: Partial<
  Pick<BoardPost, "color" | "position" | "width" | "height" | "zIndex">
>) {
  return {
    left: `${position?.x ?? 0}px`,
    top: `${position?.y ?? 0}px`,
    background: color,
    width: `${width ?? 240}px`,
    minHeight: `${height ?? 240}px`,
    height: `auto`,
    zIndex,
  };
}
