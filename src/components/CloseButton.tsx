import { usePostData } from "@/hooks/usePostData";
import { CgClose } from "react-icons/cg";

type Props = {
  id: string;
};

export default function CloseButton({ id }: Props) {
  const { delPostItem } = usePostData();

  const handleDelete = () => {
    delPostItem.mutate(id);
  };

  return (
    <button
      onClick={handleDelete}
      className="w-4 h-4 rounded-full bg-red-500 hover:point-cursor hover:bg-red-700"
    >
      <CgClose />
    </button>
  );
}
