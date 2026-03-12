"use client";
import { addPost, deletePost, getPosts, modifyPost } from "@/api/post";
import { usePost } from "@/context/PostContext";
import { Post } from "@/model/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePosition } from "./usePosition";
import { useScale } from "./useScale";
import { useSession } from "next-auth/react";

export const usePostData = (initialData?: Post[]) => {
  const queryClient = useQueryClient();
  const { updatePosition, removePost } = usePost();
  const { position } = usePosition();
  const { scale } = useScale();

  const { data: session } = useSession();
  const user = session?.user;

  const { data: posts } = useQuery<Array<Post>>({
    queryKey: ["posts", user?.id],
    queryFn: getPosts,
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: initialData,
  });

  const addPostItem = useMutation({
    mutationFn: () => addPost(posts),
    onSuccess: (data) => {
      updatePosition(
        data.id,
        window.innerWidth / 2 - position.x / scale,
        window.innerHeight / 2 - position.y - 50 / scale,
      );
      const newPosts = posts?.concat([data]);
      queryClient.setQueryData(["posts", user?.id], newPosts);
    },
  });

  const modiPostItem = useMutation({
    mutationFn: modifyPost,
    onSuccess: (data, variables) => {
      const { id, post } = variables;
      const postItem = posts?.find((p) => p.id === id);
      const modifyPost = { ...postItem, ...post };
      const newPosts = posts?.map((p) => (p.id === id ? modifyPost : p));
      queryClient.setQueryData(["posts", user?.id], newPosts);
    },
  });

  const delPostItem = useMutation({
    mutationFn: deletePost,
    onSuccess(data, variables) {
      removePost(variables);
      const newPosts = posts?.filter((p) => p.id !== variables);
      queryClient.setQueryData(["posts", user?.id], newPosts);
    },
  });

  return {
    posts,
    addPostItem,
    modiPostItem,
    delPostItem,
  };
};
