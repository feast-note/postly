"use client";

import PostSetting from "./PostSetting";
import Canvas from "./Canvas";
import ToolBar from "./ToolBar";
import PostCards from "./PostCards";
import { useBoadInteraction } from "@/hooks/useBoardInteraction";
import { usePostData } from "@/hooks/usePostData";
import { useAddMode } from "@/context/AddModeContext";

export default function Board() {
  const { totalPosts, setNewPosts } = usePostData();

  const { target, isAddMode, onAddMode } = useAddMode();

  const { refRegister, handlers, onPostMouseDown, selected } =
    useBoadInteraction((post) => {
      setNewPosts((prev) => prev.concat([post]));
      onAddMode(false);
    });

  return (
    <section
      className={`w-screen h-full overflow-hidden bg-[#333] ${isAddMode ? "cursor-crosshair" : "cursor-default"}`}
      {...handlers}
    >
      <PostSetting selected={selected} />
      <ToolBar />
      <Canvas>
        <PostCards
          posts={totalPosts}
          register={refRegister}
          selected={selected}
          onMouseDown={onPostMouseDown}
        />
        {isAddMode && <div ref={target} className="absolute"></div>}
      </Canvas>
    </section>
  );
}
