import { Post } from "@/model/post";
import PostCard, { PostCardRef } from "./PostCard";
import { useDragMode } from "@/context/DragModeContext";
import { usePostPosition } from "@/context/PositionContext";

type Props = {
  posts?: Array<Post>;
  register: (id: string) => (el: PostCardRef) => void;
  onMouseDown: (id: string) => (e: React.MouseEvent) => void;
};
export default function PostCards({ posts, register, onMouseDown }: Props) {
  const { selected } = useDragMode();
  const { positions } = usePostPosition();

  return (
    <>
      {posts?.map((post) => (
        <PostCard
          {...post}
          key={post.id}
          ref={register(post.id)}
          selected={post.id === selected ? true : false}
          onMouseDown={onMouseDown(post.id)}
          position={positions?.[post.id] ?? { x: 0, y: 0 }}
        />
      ))}
    </>
  );
}
