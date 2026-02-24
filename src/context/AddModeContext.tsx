"use client";

import { createContext, RefObject, useContext, useRef, useState } from "react";

const AddModeContext = createContext<{
  target?: RefObject<HTMLDivElement | null>;
  isAddMode: boolean;
  onAddMode: (v: boolean) => void;
  addActions: {
    init: (e: React.MouseEvent) => void;
    move: (e: React.MouseEvent) => void;
    getBounding: () => DOMRect | undefined;
  };
}>({
  target: undefined,
  isAddMode: false,
  onAddMode: () => {},
  addActions: {
    init: () => {},
    move: () => {},
    getBounding: () => undefined,
  },
});

export function AddModeProvider({ children }: { children: React.ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const onAddMode = (v: boolean) => setIsAddMode(v);

  const addActions = {
    init: (e: React.MouseEvent) => {
      const el = target?.current;
      if (!el) return;

      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
      el.style.width = "0px";
      el.style.height = "0px";
      el.style.border = "2px solid red";
    },
    move: (e: React.MouseEvent) => {
      if (!target.current) return;
      const { left, top } = target.current.getBoundingClientRect();

      target.current.style.width = e.clientX - left + "px";
      target.current.style.height = e.clientY - top + "px";
    },
    getBounding: () => target.current?.getBoundingClientRect(),
  };

  return (
    <AddModeContext.Provider
      value={{ target, isAddMode, onAddMode, addActions }}
    >
      {children}
    </AddModeContext.Provider>
  );
}

export function useAddMode() {
  return useContext(AddModeContext);
}
