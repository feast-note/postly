import { forwardRef, useImperativeHandle, useRef } from "react";
import Img from "./Img";
import { Post } from "@/model/post";

type Props = {
  selected?: boolean;
  onMouseDown: (e: React.MouseEvent<Element, MouseEvent>) => void;
} & Post;

export type PostCardRef = {
  node: HTMLElement | null;
  getInitialPosition: (e: React.MouseEvent<Element, MouseEvent>) => {
    offsetLeft: number;
    offsetTop: number;
  };
  setPosition: (x: number, y: number) => void;
};

const PostCard = forwardRef<PostCardRef, Props>(function PostCard(
  {
    id,
    zIndex,
    title,
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
      },
      node: targetRef.current,
    };
  }, [targetRef]);

  return (
    <article
      id={id}
      className={`w-60 h-60 absolute p-2 shadow-lg cursor-grab active:cursor-grabbing ${selected ? "outline-2 outline-blue-700" : ""}
      `}
      // hover:outline-2 hover:outline-blue-600
      // 초기 위치 잡아주기 (예시로 겹치지 않게 id * 250)
      style={{
        left: `${position?.x ?? 0}px`,
        top: `${position?.y ?? 0}px`,
        background: color,
        width: `${width ?? 240}px`,
        height: `${height ?? 240}px`,
        zIndex,
      }}
      ref={targetRef}
      onMouseDown={onMouseDown}
    >
      <h2 className="font-bold text-2xl text-center overflow-hidden text-ellipsis select-none">
        {title}
      </h2>
      {image && <Img image={image} />}
      <p className="w-full overflow-auto mt-2 select-none">{content}</p>
    </article>
  );
});

export default PostCard;
