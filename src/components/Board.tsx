"use client";

import Canvas from "./Canvas";
import ToolBar from "./ToolBar";
import { useBoadInteraction } from "@/hooks/useBoardInteraction";
import { usePostData } from "@/hooks/usePostData";
import { Post } from "@/model/post";
import dynamic from "next/dynamic";

const PostCards = dynamic(() => import("./PostCards"), { ssr: false });

type Props = {
  initialData?: Post[];
};
export default function Board({ initialData }: Props) {
  const { posts } = usePostData(initialData ?? []);

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
