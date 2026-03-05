"use client";
import { addPost, deletePost, getPosts, modifyPostContent } from "@/api/post";
import { usePostPosition } from "@/context/PositionContext";
import { Post } from "@/model/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePostData = () => {
  const queryClient = useQueryClient();
  const { updatePosition } = usePostPosition();

  const { data: posts } = useQuery<Array<Post>>({
    queryKey: ["posts"],
    queryFn: getPosts,
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // const [newPosts, setNewPosts] = useState<Array<Post>>([]);
  // const totalPosts = [...(posts || []), ...newPosts];
  const addPostItem = useMutation({
    mutationFn: addPost,
    onSuccess: (data, variables) => {
      updatePosition(data, variables.position.x, variables.position.y);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const modiPostItem = useMutation({
    mutationFn: modifyPostContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const delPostItem = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    posts,
    // setNewPosts,
    addPostItem,
    modiPostItem,
    delPostItem,
  };
};
