import { Ref } from "react";

type Props = {
  id: string;
  zIndex: number;
  title?: string;
  content?: string;
  targetRef?: Ref<HTMLElement>;
  handleMouseDown: (e: React.MouseEvent<Element, MouseEvent>) => void;
};
export default function PostCard({
  id,
  zIndex,
  title,
  content,
  targetRef,
  handleMouseDown,
}: Props) {
  return (
    <article
      key={id}
      className={`w-60 h-60 bg-amber-300 absolute p-2 shadow-lg z-${zIndex} cursor-grab active:cursor-grabbing`}
      // 초기 위치 잡아주기 (예시로 겹치지 않게 id * 250)
      style={{ left: 100 + Number(id) * 250, top: 100 }}
      ref={targetRef}
      onMouseDown={handleMouseDown}
    >
      <h2 className="font-bold text-2xl text-center overflow-hidden text-ellipsis select-none">
        {title}
      </h2>
      <p className="w-full overflow-auto mt-2 select-none">{content}</p>
    </article>
  );
}
