import { Post } from "@/model/post";
import { client } from "./sanity";
import { urlFor } from "./sanityImageUrl";

export async function getPostsByUsername(name: string) {
  return client
    .fetch(
      `*[_type=='post']{
    'id':_id,
    title,
    content,
    zIndex,
    position,
    color,
    image,
    author => name =='${name}'
} `,
    )
    .then((posts) => {
      const data = posts.map((post: Post) => ({
        ...post,
        image: post.image ? urlFor(post.image) : undefined,
      }));
      console.log("data", data);
      return data;
    });
}
