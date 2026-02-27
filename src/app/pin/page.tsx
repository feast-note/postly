import Board from "@/components/Board";
import { AddModeProvider } from "@/context/AddModeContext";
import { DragModeProvider } from "@/context/DragModeContext";
import { TransformProvider } from "@/context/TransformContext";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "studio",
  description: "you can create post in this Postly studio",
};

export default async function PinPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) redirect("/");

  return (
    <TransformProvider>
      <DragModeProvider>
        <AddModeProvider>
          <Board />
        </AddModeProvider>
      </DragModeProvider>
    </TransformProvider>
  );
}
