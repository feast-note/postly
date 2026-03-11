"use client";

import { useEffect, useRef, useState } from "react";

export const useDropdown = <T extends HTMLElement>() => {
  const [open, setOpen] = useState(false);
  const targetRef = useRef<T>(null);
  const onOpen = (v?: boolean) => {
    if (v) {
      setOpen(v);
    } else {
      setOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const onClick = (e: PointerEvent) => {
      e.stopPropagation();

      if (!targetRef.current) return;

      const el = targetRef.current as HTMLElement;

      if (!el.contains(e.target as HTMLElement) && open) {
        setOpen(false);
      }
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  return { targetRef, onOpen, open };
};
