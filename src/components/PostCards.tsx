import { Post } from "@/model/post";
import PostCard, { PostCardRef } from "./PostCard";
import { usePostPosition } from "@/context/PositionContext";

type Props = {
  posts: Array<Post>;
  register: (id: string) => (el: PostCardRef) => void;
  onMouseDown: (id: string) => (e: React.MouseEvent) => void;
};
export default function PostCards({ posts, register, onMouseDown }: Props) {
  const { positions } = usePostPosition();

  return (
    <>
      {posts.map((post) => (
        <PostCard
          {...post}
          key={post.id}
          ref={register(post.id)}
          onMouseDown={onMouseDown(post.id)}
          position={positions?.[post.id]}
        />
      ))}
    </>
  );
}
