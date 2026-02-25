"use client";

import PostSetting from "./PostSetting";
import Canvas from "./Canvas";
import ToolBar from "./ToolBar";
import PostCards from "./PostCards";
import { useBoadInteraction } from "@/hooks/useBoardInteraction";
import { usePostData } from "@/hooks/usePostData";
import { useAddMode } from "@/context/AddModeContext";
import AddPostMode from "./AddPostMode";

export default function Board() {
  const { totalPosts, setNewPosts } = usePostData();

  const { isAddMode } = useAddMode();

  const { refRegister, handlers, onPostMouseDown } = useBoadInteraction(
    (post) => {
      // 추후 없어질 로직 -> update sanity를 통해서 이루어질 예정
      setNewPosts((prev) => prev.concat([post]));
    },
  );

  return (
    <section
      className={`w-screen h-full overflow-hidden bg-[#333] ${isAddMode ? "cursor-crosshair" : "cursor-default"}`}
      {...handlers}
    >
      <PostSetting />
      <ToolBar />
      <Canvas>
        <PostCards
          posts={totalPosts}
          register={refRegister}
          onMouseDown={onPostMouseDown}
        />
        <AddPostMode />
      </Canvas>
    </section>
  );
}
