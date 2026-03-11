import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createPost, deletePost, getPostsByUsername } from "@/service/post";
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

  return createPost({
    userId: user.id,
  }).then((res) => NextResponse.json(res));
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response("Authentication Error", { status: 401 });
  }

  const { id } = await request.json();

  return deletePost(id)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));
}
