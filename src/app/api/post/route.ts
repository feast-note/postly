import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getPostsByUsername } from "@/service/post";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  console.log("user", user);
  if (!user) {
    return new Response("Authentication Error", { status: 401 });
  }

  return getPostsByUsername(user.name).then((res) => NextResponse.json(res));
}
