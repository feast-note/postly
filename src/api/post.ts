import { Post } from "@/model/post";
import { getPostsByUsername } from "@/service/post";

export async function getInitialPosts(username: string) {
  return getPostsByUsername(username).then((res) => res);
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
    body: JSON.stringify({
      post: {
        width: 360,
        height: 360,
        color: "rgb(255, 210, 48)",
        zIndex: 1,
      },
    }),
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
