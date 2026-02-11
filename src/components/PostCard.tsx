import { forwardRef, useImperativeHandle, useRef } from "react";

type Props = {
  id: string;
  zIndex: number;
  selected?: boolean;
  title?: string;
  content?: string;
  onMouseDown: (e: React.MouseEvent<Element, MouseEvent>) => void;
};

export type PostCardRef = {
  node: HTMLElement | null;
  getInitialPosition: (e: React.MouseEvent<Element, MouseEvent>) => {
    offsetLeft: number;
    offsetTop: number;
  };
  setPosition: (left: number, top: number) => void;
};

const PostCard = forwardRef<PostCardRef, Props>(function PostCard(
  { id, zIndex, title, content, selected, onMouseDown }: Props,
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
      setPosition(left: number, top: number) {
        const el = targetRef.current as unknown as HTMLElement;
        el.style.left = left + "px";
        el.style.top = top + "px";
      },
      node: targetRef.current,
    };
  }, [targetRef]);

  return (
    <article
      id={id}
      className={`w-60 h-60 bg-amber-300 absolute p-2 shadow-lg z-${zIndex} cursor-grab active:cursor-grabbing ${selected ? "outline-2 outline-blue-700" : ""}
      `}
      // hover:outline-2 hover:outline-blue-600
      // 초기 위치 잡아주기 (예시로 겹치지 않게 id * 250)
      style={{ left: 100 + Number(id) * 250, top: 100 }}
      ref={targetRef}
      onMouseDown={onMouseDown}
    >
      <h2 className="font-bold text-2xl text-center overflow-hidden text-ellipsis select-none">
        {title}
      </h2>
      <p className="w-full overflow-auto mt-2 select-none">{content}</p>
    </article>
  );
});

export default PostCard;
