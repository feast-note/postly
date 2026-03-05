import { Post } from "@/model/post";
import { client } from "./sanity";
import { urlFor } from "./sanityImageUrl";

export async function getPostsByUsername(name: string): Promise<Array<Post>> {
  return client
    .fetch(
      `*[_type=='post']{
      ...,
      'id':_id,
      author => name =='${name}'
} `,
    )
    .then((posts: Array<Post>) => {
      return posts.map((post: Post) => ({
        ...post,
        image: post.image ? urlFor(post.image) : undefined,
      }));
    });
}

export async function createPost({
  userId,
  width,
  height,
}: {
  userId: string;
  width?: number;
  height?: number;
}): Promise<string> {
  return client
    .create({
      _type: "post",
      width,
      height,
      zIndex: 1,
      color: "yellow",
      author: {
        _ref: userId,
        _type: "reference",
      },
    })
    .then((res) => {
      return res._id;
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
