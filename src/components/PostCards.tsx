import { Post } from "@/model/post";
import PostCard, { PostCardRef } from "./PostCard";
import { useDragMode } from "@/context/DragModeContext";

type Props = {
  posts: Array<Post>;
  register: (id: string) => (el: PostCardRef) => void;
  onMouseDown: (id: string) => (e: React.MouseEvent) => void;
};
export default function PostCards({ posts, register, onMouseDown }: Props) {
  const { selected } = useDragMode();
  return (
    <>
      {posts?.map((post) => (
        <PostCard
          {...post}
          key={post.id}
          ref={register(post.id)}
          selected={post.id === selected ? true : false}
          onMouseDown={onMouseDown(post.id)}
        />
      ))}
    </>
  );
}
