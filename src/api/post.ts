import { CreatePost } from "@/model/post";

export async function getPosts() {
  return fetch("/api/post")
    .then((res) => res.json())
    .catch((error) => error);
}

export async function addPost(post: CreatePost): Promise<string> {
  return fetch("/api/post", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post: {
        width: post.width,
        height: post.height,
        color: post.color,
        zIndex: post.zIndex,
      },
    }),
  }).then((res) => res.json());
}

export async function modifyPostContent({
  id,
  content,
}: {
  id: string;
  content: string;
}) {
  return fetch(`/api/content`, {
    method: "PUT",
    body: JSON.stringify({ id, post: { content } }),
  }).then((res) => res.json());
}

export async function deletePost(id: string) {
  return fetch("/api/post", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  }).then((res) => res.json());
}
