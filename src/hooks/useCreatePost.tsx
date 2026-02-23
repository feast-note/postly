"use client";

import { RefObject } from "react";

export const useCreatePost = (el: RefObject<HTMLDivElement | null>) => {
  const create = {
    init: (e: React.MouseEvent) => {
      if (!el.current) return;
      el.current.style.left = e.clientX + "px";
      el.current.style.top = e.clientY + "px";
      el.current.style.width = "0px";
      el.current.style.height = "0px";
      el.current.style.border = "2px solid red";
    },
    move: (e: React.MouseEvent) => {
      if (!el.current) return;
      const { left, top } = el.current.getBoundingClientRect();

      el.current.style.width = e.clientX - left + "px";
      el.current.style.height = e.clientY - top + "px";
    },
  };
  return { create };
};
