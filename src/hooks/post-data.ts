"use client";
import { addPost, deletePost, getPosts, modifyPost } from "@/api/post";
import { usePost } from "@/context/PostContext";
import { Post } from "@/model/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePosition } from "./position";
import { useScale } from "./scale";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const usePostData = (initialData?: Post[]) => {
  const pathname = usePathname();
  const apiKey = pathname.includes("test") ? "/api/test" : "/api/post";

  const queryClient = useQueryClient();
  const { updatePosition, removePost } = usePost();
  const { position } = usePosition();
  const { scale } = useScale();

  const { data: session } = useSession();
  const user = session?.user;

  const queryUniqueKey = apiKey === "/api/post" ? user?.id : "test";

  const { data: posts } = useQuery<Array<Post>>({
    queryKey: ["posts", queryUniqueKey],
    queryFn: () => getPosts(apiKey),
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: initialData,
    enabled: !!user?.id,
  });

  const addPostItem = useMutation({
    mutationFn: () => addPost(posts, apiKey),
    onSuccess: (data) => {
      updatePosition(
        data.id,
        window.innerWidth / 2 - position.x / scale,
        window.innerHeight / 2 - position.y - 50 / scale,
      );
      const newPosts = posts?.concat([data]);
      queryClient.setQueryData(["posts", queryUniqueKey], newPosts);
    },
  });

  const modiPostItem = useMutation({
    mutationFn: ({
      id,
      post,
    }: {
      id: string;
      post: Partial<Omit<Post, "id">>;
    }) =>
      modifyPost(
        {
          id,
          post,
        },
        pathname.includes("test") ? "/api/test" : undefined,
      ),
    onSuccess: (data, variables) => {
      const { id, post } = variables;
      const postItem = posts?.find((p) => p.id === id);
      const modifyPost = { ...postItem, ...post };
      const newPosts = posts?.map((p) => (p.id === id ? modifyPost : p));
      queryClient.setQueryData(["posts", queryUniqueKey], newPosts);
    },
  });

  const delPostItem = useMutation({
    mutationFn: (id: string) => deletePost(id, apiKey),
    onSuccess(data, variables) {
      removePost(variables);
      const newPosts = posts?.filter((p) => p.id !== variables);
      queryClient.setQueryData(["posts", queryUniqueKey], newPosts);
    },
  });

  return {
    posts,
    addPostItem,
    modiPostItem,
    delPostItem,
  };
};
