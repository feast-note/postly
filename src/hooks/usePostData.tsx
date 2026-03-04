"use client";
import { usePostPosition } from "@/context/PositionContext";
import { Position, Post } from "@/model/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

async function addPost(
  post: Omit<Post, "id"> & { position: Position },
): Promise<string> {
  return fetch("/api/post", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post: {
        width: post.width,
        height: post.height,
        color: post.color,
        zIndex: post.zIndex,
      },
    }),
  }).then((res) => res.json());
}
export const usePostData = () => {
  const queryClient = useQueryClient();
  const { updatePosition } = usePostPosition();

  const { data: posts } = useQuery<Array<Post>>({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("/api/post")
        .then((res) => res.json())
        .catch((error) => error),
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const [newPosts, setNewPosts] = useState<Array<Post>>([]);
  const totalPosts = [...(posts || []), ...newPosts];
  const mutation = useMutation({
    mutationFn: addPost,
    onSuccess: (data, variables) => {
      updatePosition(data, variables.position.x, variables.position.y);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    posts: totalPosts,
    setNewPosts,
    postPost: mutation,
  };
};
