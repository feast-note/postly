"use client";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Img from "./Img";
import { BoardPost } from "@/model/post";
import { usePostPosition } from "@/context/PositionContext";
import { CgClose } from "react-icons/cg";

type Props = {
  selected?: boolean;
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
    selected,
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

  const [contentInput, setContentInput] = useState(content ?? "");
  return (
    <article
      id={id}
      className={`flex flex-col rounded-md absolute shadow-lg cursor-grab active:cursor-grabbing ${selected ? "outline-2 outline-blue-700" : ""}
      `}
      style={{
        left: `${position?.x ?? 0}px`,
        top: `${position?.y ?? 0}px`,
        background: color,
        width: `${width ?? 240}px`,
        minHeight: `${height ?? 240}px`,
        height: `auto`,
        zIndex,
      }}
      ref={targetRef}
      onMouseDown={onMouseDown}
    >
      <div className="text-right p-2">
        <button className="w-4 h-4 rounded-full bg-red-500 hover:point-cursor hover:bg-red-700">
          <CgClose />
        </button>
      </div>
      <div className="p-2 flex-1 flex flex-col">
        {image && <Img image={image} />}
        <textarea
          className="w-full flex-1 mt-2 resize-none select-auto"
          name="content"
          value={contentInput}
          placeholder="Enter content here"
          onChange={(e) => {
            e.stopPropagation();
            console.log("content change : ", e.currentTarget.value);
            setContentInput(e.currentTarget.value);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
    </article>
  );
});

export default PostCard;
