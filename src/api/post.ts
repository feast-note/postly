import { Post } from "@/model/post";
import { getPostsByUserId } from "@/service/post";

export async function getInitialPosts(id: string) {
  return getPostsByUserId(id).then((res) => res);
}
export async function getPosts() {
  return fetch("/api/post")
    .then((res) => res.json())
    .catch((error) => error);
}

export async function addPost(): Promise<Post> {
  return fetch("/api/post", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export async function modifyPost({
  id,
  post,
}: {
  id: string;
  post: Partial<Omit<Post, "id">>;
}) {
  return fetch(`/api/content`, {
    method: "PUT",
    body: JSON.stringify({ id, post }),
  }).then((res) => res.json());
}

export async function deletePost(id: string) {
  return fetch("/api/post", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  }).then((res) => res.json());
}
