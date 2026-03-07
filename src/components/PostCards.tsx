import { Post } from "@/model/post";
import PostCard, { PostCardRef } from "./PostCard";
import { usePostPosition } from "@/context/PositionContext";
import { useSelect } from "@/context/SelectContext";

type Props = {
  posts: Array<Post>;
  register: (id: string) => (el: PostCardRef) => void;
  onMouseDown: (id: string) => (e: React.MouseEvent) => void;
};
export default function PostCards({ posts, register, onMouseDown }: Props) {
  const { positions } = usePostPosition();
  const { selected } = useSelect();

  return (
    <>
      {posts.map((post) => (
        <PostCard
          {...post}
          key={post.id}
          ref={register(post.id)}
          onMouseDown={onMouseDown(post.id)}
          position={positions?.[post.id]}
          selected={selected === post.id}
        />
      ))}
    </>
  );
}
