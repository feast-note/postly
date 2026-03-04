"use client";
import { Position } from "@/model/post";
import { createContext, RefObject, useContext, useRef, useState } from "react";

const AddModeContext = createContext<{
  target?: RefObject<HTMLDivElement | null>;
  isAddMode: boolean;
  onAddMode: (v: boolean) => void;
  addActions: {
    init: (e: React.MouseEvent, position: Position, scale: number) => void;
    move: (e: React.MouseEvent, position: Position, scale: number) => void;
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
  const [isAddMode, setIsAddMode] = useState(true);
  const onAddMode = (v: boolean) => setIsAddMode(v);

  const startPos = useRef({ x: 0, y: 0 });

  const addActions = {
    init: (e: React.MouseEvent, position: Position, scale: number) => {
      const el = target?.current;
      if (!el) return;

      const x = (e.clientX - position.x) / scale;
      const y = (e.clientY - position.y) / scale;

      startPos.current = { x, y };

      Object.assign(el.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: "0px",
        height: "0px",
        boxSizing: "border-box",
        border: "2px solid rgb(255, 210, 48)",
        display: "block",
        pointerEvents: "none", // 마우스 이벤트를 방해하지 않게 설정
      });
    },

    move: (
      e: React.MouseEvent,
      position: { x: number; y: number },
      scale: number,
    ) => {
      const el = target.current;
      if (!el) return;

      const currentX = (e.clientX - position.x) / scale;
      const currentY = (e.clientY - position.y) / scale - 50; // 상단 메뉴 높이 보정

      const width = currentX - startPos.current.x;
      const height = currentY - startPos.current.y;

      el.style.width = `${Math.abs(width)}px`;
      el.style.height = `${Math.abs(height)}px`;
      el.style.left = `${Math.min(currentX, startPos.current.x)}px`;
      el.style.top = `${Math.min(currentY, startPos.current.y)}px`;
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
