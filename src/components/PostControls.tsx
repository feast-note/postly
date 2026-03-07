import { useState } from "react";
import CloseButton from "./CloseButton";
import EditButton from "./EditButton";
import ModalPortal from "./ModalPortal";
import PostModal from "./PostModal";
import { Post } from "@/model/post";
import { usePostData } from "@/hooks/usePostData";

const PostEdit = ({ post }: Props) => {
  const [edit, setEdit] = useState(false);
  const onEdit = (v: boolean) => setEdit(v);
  return (
    <>
      <EditButton onClick={() => onEdit(true)} />
      {edit && (
        <ModalPortal>
          <PostModal onClose={() => setEdit(false)} post={post} />
        </ModalPortal>
      )}
    </>
  );
};

const PostClose = ({ post }: Props) => {
  const { delPostItem } = usePostData();

  const handleDelete = () => {
    delPostItem.mutate(post.id);
  };
  return <CloseButton onClick={handleDelete} />;
};

type Props = {
  post: Post;
};
export default function PostControls({ post }: Props) {
  return (
    <div className="flex justify-end text-right p-2 gap-1">
      <PostEdit post={post} />
      <PostClose post={post} />
    </div>
  );
}
