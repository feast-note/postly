"use client";

import { Post } from "@/model/post";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const usePostData = () => {
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

  return {
    totalPosts,
    setNewPosts,
  };
};
