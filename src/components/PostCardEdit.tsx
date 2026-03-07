import { BoardPost, Post } from "@/model/post";
import PostContentForm from "./PostContentForm";

type Props = Post;
export default function PostCardEdit({
  id,
  width,
  height,
  color,
  zIndex,
  content,
}: Props) {
  return (
    <article
      id={id}
      className="flex flex-col rounded-md absolute shadow-lg"
      style={getPostCardStyle({
        color,
        width,
        height,
        zIndex,
      })}
    >
      <div className="flex justify-end text-right p-2 gap-1"></div>
      <div className="p-2 flex-1 flex flex-col">
        <PostContentForm id={id} content={content} />
      </div>
    </article>
  );
}

function getPostCardStyle({
  color,
  width,
  height,
  zIndex,
}: Partial<Pick<BoardPost, "color" | "width" | "height" | "zIndex">>) {
  return {
    background: color,
    width: `${width ?? 240}px`,
    minHeight: `${height ?? 240}px`,
    height: `auto`,
    zIndex,
  };
}
