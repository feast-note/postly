import { Post } from "@/model/post";
import { client } from "./sanity";

export async function getPostsByUserId(id: string): Promise<Array<Post>> {
  return client.fetch(
    `*[_type=='post'&& author->_id=="${id}"]{
      ...,
      'id':_id,
} `,
  );
}

export async function createPost({
  userId,
}: {
  userId: string;
  width?: number;
  height?: number;
}): Promise<Post> {
  return client
    .create({
      _type: "post",
      zIndex: 1,
      author: {
        _ref: userId,
        _type: "reference",
      },
    })
    .then((res) => {
      return { ...res, id: res._id };
    });
}

export async function modifyPost(id: string, post: Partial<Omit<Post, "id">>) {
  return client
    .patch(id)
    .set({ ...post })
    .commit({ autoGenerateArrayKeys: true });
}

export async function deletePost(id: string) {
  return client.delete(id);
}
