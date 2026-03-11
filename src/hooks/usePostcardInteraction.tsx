"use client";

import { PostCardRef } from "@/components/PostCard";
import { useRef } from "react";

export const usePostcardInteraction = () => {
  const postsRef = useRef<Map<string, PostCardRef>>(new Map());

  const onRef = (id: string) => (el: PostCardRef) => {
    if (el) {
      postsRef.current.set(id, el);
    } else {
      postsRef.current.delete(id);
    }
  };

  const getSelectedRef = (id: string) => postsRef.current.get(id);

  const postRef = {
    register: (id: string) => (el: PostCardRef) => onRef(id)(el),
    move: (x: number, y: number) => (id: string) =>
      getSelectedRef(id)?.setPosition(x, y),
    init: (e: React.MouseEvent) => (id: string) =>
      getSelectedRef(id)?.getInitialPosition(e) ?? undefined,
  };

  return { postRef };
};
