"use client";

import PostSetting from "./PostSetting";
import Canvas from "./Canvas";
import ToolBar from "./ToolBar";
import AddPost from "./AddPost";
import PostCards from "./PostCards";
import { useBoadInteraction } from "@/hooks/useBoardInteraction";
import { usePostData } from "@/hooks/usePostData";
import { useAddMode } from "@/context/AddModeContext";

export type Drag = "NONE" | "CANVAS" | "POST" | "CREATE";

export default function Board() {
  const { totalPosts, setNewPosts } = usePostData();

  const { target, isAddMode, onAddMode } = useAddMode();

  const { refRegister, handlers, onDragMode, onPostMouseDown, selected } =
    useBoadInteraction((post) => {
      setNewPosts((prev) => prev.concat([post]));
      onAddMode(false);
    });

  const onToggle = (v: boolean) => {
    onAddMode(v);
    if (!v) {
      onDragMode("NONE");
    } else {
      onDragMode("CREATE");
    }
  };

  return (
    <section
      className={`w-screen h-full overflow-hidden bg-[#333] ${isAddMode ? "cursor-crosshair" : "cursor-default"}`}
      {...handlers}
    >
      <PostSetting selected={selected} />
      <ToolBar>
        <AddPost onToggle={onToggle} />
      </ToolBar>
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
