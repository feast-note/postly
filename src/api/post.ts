import { Post } from "@/model/post";
import { getPostsByUserId } from "@/service/post";

export async function getInitialPosts(id: string) {
  return getPostsByUserId(id).then((res) => res);
}

export async function getPosts(apiKey: string = "/api/post") {
  console.log("api", apiKey);
  return fetch(apiKey)
    .then((res) => res.json())
    .catch((error) => error);
}

export async function addPost(
  posts?: Post[],
  apiKey: string = "/api/post",
): Promise<Post> {
  return fetch(apiKey, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ posts }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    })
    .catch((error) => {
      throw error;
    });
}

export async function modifyPost(
  { id, post }: { id: string; post: Partial<Omit<Post, "id">> },
  apiKey?: string,
) {
  return fetch(apiKey ?? "/api/content", {
    method: "PUT",
    body: JSON.stringify({ id, post }),
  }).then((res) => res.json());
}

export async function deletePost(id: string, apiKey: string = "/api/post") {
  return fetch(apiKey, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  }).then((res) => res.json());
}
