import {
  createPost,
  deletePost,
  getPostsByTest,
  modifyPost,
} from "@/service/post";
import { NextResponse } from "next/server";

export async function GET() {
  return getPostsByTest().then((res) => NextResponse.json(res));
}

export async function POST(request: Request) {
  const { posts } = await request.json();

  if (posts && posts.length >= 1000) {
    return NextResponse.json(
      { message: "You can create up to 100 posts." },
      {
        status: 403,
      },
    );
  }

  return createPost({}).then((res) => NextResponse.json(res));
}

export async function PUT(request: Request) {
  const { id, post } = await request.json();

  return modifyPost(id, post)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  return deletePost(id)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));
}
