import { Post } from "@/model/post";
import PostCard from "./PostCard";
import { usePost } from "@/context/PostContext";

type Props = {
  posts: Array<Post>;
  register: (id: string) => (el: HTMLElement) => void;
  onMouseDown: (
    id: string,
    x: number,
    y: number,
  ) => (e: React.MouseEvent) => void;
};
export default function PostCards({ posts, register, onMouseDown }: Props) {
  const { postState } = usePost();

  return (
    <>
      {posts.map((post) => (
        <PostCard
          {...post}
          key={post.id}
          ref={register(post.id)}
          onMouseDown={onMouseDown}
          state={postState?.[post.id]}
        />
      ))}
    </>
  );
}
