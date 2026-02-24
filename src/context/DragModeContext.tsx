"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

export type Drag = "NONE" | "CANVAS" | "POST" | "CREATE";

interface DragModeContextType {
  dragMode: () => Drag;
  onDragMode: (v: Drag) => void;
}

const DragModeContext = createContext<DragModeContextType | null>({
  dragMode: () => "NONE",
  onDragMode: () => {},
});

export function DragModeProvider({ children }: { children: ReactNode }) {
  const dragModeRef = useRef<Drag>("NONE");
  const onDragMode = (v: Drag) => (dragModeRef.current = v);
  const dragMode = () => dragModeRef.current;

  return (
    <DragModeContext.Provider value={{ onDragMode, dragMode }}>
      {children}
    </DragModeContext.Provider>
  );
}

export const useDragMode = () => {
  const context = useContext(DragModeContext);
  if (!context) throw new Error("DragModeProvider 내에서 사용해주세요.");
  return context;
};
