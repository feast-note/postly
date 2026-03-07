"use client";
import { addPost, deletePost, getPosts, modifyPost } from "@/api/post";
import { usePostPosition } from "@/context/PositionContext";
import { Post } from "@/model/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePosition } from "./usePosition";
import { useScale } from "./useScale";

export const usePostData = () => {
  const queryClient = useQueryClient();
  const { updatePosition } = usePostPosition();
  const { position } = usePosition();
  const { scale } = useScale();

  const { data: posts } = useQuery<Array<Post>>({
    queryKey: ["posts"],
    queryFn: getPosts,
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const addPostItem = useMutation({
    mutationFn: addPost,
    onSuccess: (data) => {
      updatePosition(
        data.id,
        window.innerWidth / 2 - position.x / scale,
        window.innerHeight / 2 - position.y - 50 / scale,
      );
      const newPosts = posts?.concat([data]);
      queryClient.setQueryData(["posts"], newPosts);
    },
  });

  const modiPostItem = useMutation({
    mutationFn: modifyPost,
    onMutate: (variables) => {
      const { id, post } = variables;
      const postItem = posts?.find((p) => p.id === id);
      const modifyPost = { ...postItem, ...post };
      const newPosts = posts?.map((p) => (p.id === id ? modifyPost : p));
      queryClient.setQueryData(["posts"], newPosts);
    },
  });

  const delPostItem = useMutation({
    mutationFn: deletePost,
    onMutate(variables) {
      const newPosts = posts?.filter((p) => p.id !== variables);
      queryClient.setQueryData(["posts"], newPosts);
    },
  });

  return {
    posts,
    addPostItem,
    modiPostItem,
    delPostItem,
  };
};
