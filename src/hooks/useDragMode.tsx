import { useRef } from "react";

export type Drag = "NONE" | "CANVAS" | "POST";

export const useDragMode = () => {
  const dragModeRef = useRef<Drag>("NONE");
  const onDragMode = (v: Drag) => (dragModeRef.current = v);
  const dragMode = () => dragModeRef.current;

  return { dragMode, onDragMode };
};
