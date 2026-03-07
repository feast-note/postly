import { Post } from "@/model/post";
import CloseButton from "./CloseButton";
import PostCardEdit from "./PostCardEdit";
import PostSetting from "./PostSetting";
import React, { ChangeEvent, useState } from "react";
import { colorNameToHex } from "@/app/utils/color";
import { usePostData } from "@/hooks/usePostData";

type Props = {
  onClose: () => void;
  post: Post;
};
export default function PostModal({ onClose, post }: Props) {
  const { color, width, height } = post;

  const { modiPostItem } = usePostData();

  const getHexColor = (color: string) => {
    if (color.startsWith("#")) return color;
    return colorNameToHex(color) || '"#ffff00"';
  };

  const handleBoundary = (e: ChangeEvent, setValue: (v: number) => void) => {
    const v = Number((e.target as EventTarget & HTMLInputElement).value);
    return v < 240 ? setValue(240) : v > 700 ? setValue(700) : setValue(v);
  };

  const [postColor, setPostColor] = useState(getHexColor(color));
  const [postWidth, setPostWidth] = useState(() => width);
  const [postHeight, setPostHeight] = useState(() => height);

  const handleEditSave = (e: React.SubmitEvent) => {
    e.preventDefault();
    modiPostItem.mutate({
      id: post.id,
      post: { color: postColor, width: postWidth, height: postHeight },
    });
    onClose();
  };

  return (
    <section
      className="fixed top-0 left-0 flex flex-col w-full h-full bg-neutral-900/80 justify-center items-center z-50"
      draggable="false"
    >
      <div className="bg-white w-3/5 h-4/5 min-w-310 backdrop-blur-sm">
        <div className="absolute top-3 right-3">
          <CloseButton onClick={onClose} />
        </div>
        <div className="flex w-full h-full">
          <div className="basis-4/5 flex items-center justify-center bg-gray-600 relative">
            <PostCardEdit
              {...post}
              color={postColor}
              width={postWidth}
              height={postHeight}
            />
            <div
              className="absolute pointer-events-none opacity-20 w-full h-full"
              style={{
                background: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>
          <div className="basis-1/5 p-2 mt-10">
            <PostSetting>
              <form onSubmit={handleEditSave}>
                <ul className="flex flex-col gap-5 mb-10">
                  <li className="p-2 w-full">
                    <h3 className="font-bold text-d">Color</h3>
                    <div className="flex gap-2 mt-4 justify-between">
                      <input
                        type="color"
                        value={postColor}
                        name="background"
                        onChange={(e) => setPostColor(e.target.value)}
                      />
                      <input
                        type="text"
                        value={postColor}
                        onChange={(e) => setPostColor(e.target.value)}
                        className="bg-neutral-200 rounded-md w-17"
                      />
                    </div>
                  </li>
                  <li className="p-2 w-full">
                    <h2 className="font-bold text-md">Layout</h2>
                    <div className="flex gap-2 mt-4 flex-col">
                      <span className="flex justify-between">
                        <label
                          htmlFor="width"
                          className="text-gray-600 text-sm"
                        >
                          width
                        </label>
                        <input
                          type="number"
                          id="width"
                          name="width"
                          value={postWidth}
                          onChange={(e) => handleBoundary(e, setPostWidth)}
                          className="bg-neutral-200 rounded-md w-16"
                          max={700}
                          min={240}
                        />
                      </span>
                      <span className="flex justify-between">
                        <label
                          htmlFor="width"
                          className="text-gray-600 text-sm"
                        >
                          height
                        </label>
                        <input
                          type="number"
                          id="height"
                          name="height"
                          value={postHeight}
                          max={700}
                          min={240}
                          onChange={(e) => handleBoundary(e, setPostHeight)}
                          className="bg-neutral-200 rounded-md w-16"
                        />
                      </span>
                    </div>
                  </li>
                </ul>
                <button className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md w-full">
                  modify
                </button>
              </form>
            </PostSetting>
          </div>
        </div>
      </div>
    </section>
  );
}
