import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createPost, deletePost, getPostsByUserId } from "@/service/post";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response("Authentication Error", { status: 401 });
  }

  return getPostsByUserId(user.id).then((res) => NextResponse.json(res));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response("Authentication Error", { status: 401 });
  }

  const { posts } = await request.json();

  if (posts && posts.length >= 1000) {
    return NextResponse.json(
      { message: "You can create up to 100 posts." },
      {
        status: 403,
      },
    );
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
