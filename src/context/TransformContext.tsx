"use client";

import { usePosition } from "@/hooks/position";
import { useScale } from "@/hooks/scale";
import { createContext, useContext } from "react";

const TransformContext = createContext<{
  scale: number;
  onScale: (e: React.WheelEvent) => void;
  position: { x: number; y: number };
  onPosition: (x: number, y: number) => void;
}>({
  scale: 1,
  position: { x: 1, y: 1 },
  onScale: () => {},
  onPosition: () => {},
});

export function TransformProvider({ children }: { children: React.ReactNode }) {
  const { scale, onScale } = useScale();
  const { position, onPosition } = usePosition();

  return (
    <TransformContext.Provider value={{ scale, onScale, position, onPosition }}>
      {children}
    </TransformContext.Provider>
  );
}

export function useTransform() {
  return useContext(TransformContext);
}
