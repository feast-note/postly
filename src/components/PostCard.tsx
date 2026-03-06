"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import Img from "./Img";
import { BoardPost } from "@/model/post";
import { usePostPosition } from "@/context/PositionContext";
import PostContentForm from "./PostContentForm";
import CloseButton from "./CloseButton";
import { useSelect } from "@/context/SelectContext";

type Props = {
  onMouseDown: (e: React.MouseEvent<Element, MouseEvent>) => void;
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
  {
    id,
    zIndex,
    content,
    color,
    onMouseDown,
    image,
    width,
    height,
    position,
  }: Props,
  ref,
) {
  const targetRef = useRef<HTMLElement>(null);
  const { updatePosition } = usePostPosition();
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
  }, [id, updatePosition]);

  return (
    <article
      id={id}
      className={getBasicStyle(selected === id ? true : false)}
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
      <div className="text-right p-2">
        <CloseButton id={id} />
      </div>
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

  return `flex flex-col rounded-md absolute shadow-lg cursor-grab active:cursor-grabbing ${selectStyle}`;
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
