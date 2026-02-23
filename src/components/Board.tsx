"use client";

import PostSetting from "./PostSetting";
import Canvas from "./Canvas";
import { useScale } from "@/hooks/useScale";
import { usePosition } from "@/hooks/usePosition";
import ToolBar from "./ToolBar";
import AddPost from "./AddPost";
import { useAddPost } from "@/hooks/useAddPost";
import PostCards from "./PostCards";
import { useBoadInteraction } from "@/hooks/useBoardInteraction";
import { usePostData } from "@/hooks/usePostData";

export type Drag = "NONE" | "CANVAS" | "POST" | "CREATE";

export default function Board() {
  const { totalPosts, setNewPosts } = usePostData();

  const posTools = usePosition();
  const { scale, onScale } = useScale();

  const { onAddMode, isAddMode } = useAddPost();

  const {
    refRegister,
    handlers,
    onDragMode,
    onPostMouseDown,
    selected,
    addModeRef,
  } = useBoadInteraction(posTools, scale, (post) => {
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
      onWheel={onScale}
      {...handlers}
    >
      <PostSetting selected={selected} />
      <ToolBar>
        <AddPost onToggle={onToggle} />
      </ToolBar>
      <Canvas position={posTools.position} scale={scale}>
        <PostCards
          posts={totalPosts}
          register={refRegister}
          selected={selected}
          onMouseDown={onPostMouseDown}
        />
        {isAddMode && <div ref={addModeRef} className="absolute"></div>}
      </Canvas>
    </section>
  );
}
