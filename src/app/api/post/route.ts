import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createPost, getPostsByUsername } from "@/service/post";
import { NextResponse } from "next/server";
import { Post } from "@/model/post";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response("Authentication Error", { status: 401 });
  }

  return getPostsByUsername(user.name).then((res) => NextResponse.json(res));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response("Authentication Error", { status: 401 });
  }

  const { post } = await request.json();

  console.log("post", post);
  const { width, height } = post as Post;

  return createPost({
    userId: user.id,
    width,
    height,
  }).then((res) => NextResponse.json(res));
}
