import { SanityImageObject } from "@sanity/image-url";
import { client } from "./sanity";

export type Post = {
  id: string;
  title?: string;
  content?: string;
  zIndex: number;
  color: string;
  image: SanityImageObject;
};

export async function getPostsByUsername(name: string) {
  return client.fetch(`*[_type=='post']{
    'id':_id,
    title,
    content,
    zIndex,
    position,
    color,
    image,
    author => name =='${name}'
} `);
}
