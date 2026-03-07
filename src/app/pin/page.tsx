import Board from "@/components/Board";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import BoardStateProvider from "@/components/BoardStateProvider";

export const metadata: Metadata = {
  title: "studio",
  description: "you can create post in this Postly studio",
};

export default async function PinPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) redirect("/");

  return (
    <BoardStateProvider>
      <Board />
      <div id="portal"></div>
    </BoardStateProvider>
  );
}
