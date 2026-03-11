import { client } from "./sanity";

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export async function addUser({ id, name, email, image }: User) {
  return client.createIfNotExists({
    _id: id,
    _type: "user",
    name,
    email,
    image: image || "",
  });
}
