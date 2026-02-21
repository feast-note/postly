"use client";
import { useDropdown } from "@/hooks/useDropdown";
import { useState } from "react";
import { BsCheck } from "react-icons/bs";
import { FcEditImage } from "react-icons/fc";
import { IoSquare } from "react-icons/io5";
import { MdKeyboardArrowDown, MdOutlinePostAdd } from "react-icons/md";

const addPostList = [
  {
    icon: <IoSquare size={20} color={"yellow"} />,
    title: "simple card",
    type: "simple-card",
  },
  {
    icon: <FcEditImage size={20} />,
    title: "image card",
    type: "image-card",
  },
];

type Props = {
  onToggle: (v: boolean) => void;
};

export default function AddPost({ onToggle }: Props) {
  const { open, targetRef, onOpen } = useDropdown<HTMLDivElement>();

  const [postType, setPostType] = useState("simple-card");

  return (
    <>
      {open && (
        <div
          className="absolute bottom-6 left-4 mb-5 bg-white p-2 w-48 rounded-sm"
          ref={targetRef}
        >
          <ul className="flex gap-2 flex-col w-full">
            {addPostList.map(({ icon, title, type }) => (
              <li
                className="text-sm w-full flex text-center gap-2 p-1 hover:bg-blue-300 rounded-md"
                key={title}
                onClick={() => {
                  setPostType(type);
                  onOpen(false);
                  onToggle(true);
                }}
              >
                <BsCheck
                  size={20}
                  className={postType === type ? "visible" : "invisible"}
                />

                {icon}
                {title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="flex items-center text-gray-300 border-[0.1px] p-1 rounded-sm border-gray-300 hover:bg-neutral-950"
        onClick={() => onOpen()}
      >
        <span>
          <MdOutlinePostAdd size={17} />
        </span>
        <span>
          <MdKeyboardArrowDown size={15} />
        </span>
      </button>
    </>
  );
}
