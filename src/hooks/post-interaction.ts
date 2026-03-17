"use client";

import { useRef } from "react";
import { usePost } from "@/context/PostContext";

export const usePostcardInteraction = () => {
  const postsRef = useRef<Map<string, HTMLElement>>(new Map());
  const { updatePosition } = usePost();

  const onRef = (id: string) => (el: HTMLElement) => {
    if (el) {
      postsRef.current.set(id, el);
    } else {
      postsRef.current.delete(id);
    }
  };

  const postRef = {
    register: (id: string) => (el: HTMLElement) => onRef(id)(el),
    move: (x: number, y: number) => (id: string) => updatePosition(id, x, y),
  };

  return { postRef };
};
