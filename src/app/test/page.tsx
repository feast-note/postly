import Board from "@/components/Board";
import { Metadata } from "next";
import BoardStateProvider from "@/components/BoardStateProvider";
import { getPostsByTest } from "@/service/post";

export const metadata: Metadata = {
  title: "test studio",
  description: "you can create post in this Postly studio",
};

export default async function TestPage() {
  const initialData = await getPostsByTest();
  return (
    <BoardStateProvider>
      <Board initialData={initialData} />
      <div id="portal"></div>
    </BoardStateProvider>
  );
}
