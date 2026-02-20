"use client";

import { PostCardRef } from "@/components/PostCard";
import { useRef, useState } from "react";

export const usePostcardInteraction = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const postsRef = useRef<Map<string, PostCardRef>>(new Map());

  const onRef = (id: string) => (el: PostCardRef) => {
    if (el) postsRef.current.set(id, el);
  };

  const getSelectedRef = (id: string) => postsRef.current.get(id);

  const onSelect = (id: string | null) => setSelected(id);

  return { onRef, selected, onSelect, getSelectedRef };
};
