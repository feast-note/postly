"use client";

import Canvas from "./Canvas";
import ToolBar from "./ToolBar";
import PostCards from "./PostCards";
import { useBoadInteraction } from "@/hooks/useBoardInteraction";
import { usePostData } from "@/hooks/usePostData";

export default function Board() {
  const { posts } = usePostData();

  const { refRegister, handlers, onPostMouseDown } = useBoadInteraction();

  return (
    <section
      className={`w-screen h-full overflow-hidden bg-[#333]`}
      {...handlers}
    >
      <ToolBar />
      <Canvas>
        {posts && (
          <PostCards
            posts={posts}
            register={refRegister}
            onMouseDown={onPostMouseDown}
          />
        )}
      </Canvas>
    </section>
  );
}
