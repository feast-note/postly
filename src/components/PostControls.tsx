import CloseButton from "./CloseButton";
import { BoardPost } from "@/model/post";
import { usePostData } from "@/hooks/usePostData";
import { useDropdown } from "@/hooks/useDropdown";
import ColorButton from "./ColorButton";
import { useRef, useState } from "react";
import { usePost } from "@/context/PostContext";
import ModalPortal from "./ModalPortal";

const colorList = [
  { color: "#a5f3fc", title: "light-cyan" },
  { color: "#06b6d4", title: "cyan" },
  { color: "#bfdbfe", title: "light-blue" },
  { color: "#0ea5e9", title: "blue" },
  { color: "#e9d5ff", title: "light-purple" },
  { color: "#8b5cf6", title: "purple" },
  { color: "#ffedd5", title: "light-orange" },
  { color: "#f97316", title: "orange" },
  { color: "#fbcfe8", title: "light-pink" },
  { color: "#ec4899", title: "pink" },
  { color: "#fecaca", title: "light-red" },
  { color: "#ef4444", title: "red" },
  { color: "#fef08a", title: "light-yellow" },
  { color: "#fde047", title: "yellow" },
  { color: "#bbf7d0", title: "light-green" },
  { color: "#22c55e", title: "green" },
];

const PostColor = ({ post }: Props) => {
  const containerRef = useRef(null);
  const { open, targetRef, onOpen } = useDropdown<HTMLDivElement>();
  const { updateState } = usePost();
  const [color, setColor] = useState(post.color);

  const handleColor = (color: string) => {
    setColor(color);
    updateState(post.id, { color });
  };

  const { position } = post;
  console.log("po", position);

  return (
    <div id="tooltip-layer">
      <ColorButton onClick={() => onOpen(true)} />
      {open && (
        <ModalPortal target={post.id}>
          <div
            ref={targetRef}
            className="absolute -right-45 bg-white p-2 w-44 rounded-md cursor-pointer z-50"
          >
            <h3 className="text-center font-semibold mb-3">배경 색상</h3>
            <ul className="flex flex-col gap-1">
              {colorList.map((item) => (
                <li
                  key={item.color}
                  className={`flex gap-2 items-center hover:bg-gray-100 ${color === item.color && "bg-purple-100"}`}
                  onClick={() => handleColor(item.color)}
                >
                  <div
                    className="border border-gray-200 rounded-sm"
                    style={{
                      background: item.color,
                      width: "23px",
                      height: "23px",
                    }}
                  />
                  <p className="text-md text-gray-600">{item.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </ModalPortal>
      )}
    </div>
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
  post: BoardPost;
};
export default function PostControls({ post }: Props) {
  return (
    <div className="flex justify-end text-right p-2 gap-1 w-full">
      <PostColor post={post} />
      <PostClose post={post} />
    </div>
  );
}
