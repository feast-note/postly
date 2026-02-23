import { Post } from "@/model/post";
import PostCard, { PostCardRef } from "./PostCard";

type Props = {
  posts: Array<Post>;
  register: (id: string) => (el: PostCardRef) => void;
  selected: string | null;
  onMouseDown: (id: string) => (e: React.MouseEvent) => void;
};
export default function PostCards({
  posts,
  register,
  selected,
  onMouseDown,
}: Props) {
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
