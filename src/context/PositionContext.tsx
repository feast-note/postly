"use client";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type PostPositionRecord = Record<string, { x: number; y: number }>;

const PositionContext = createContext<{
  positions?: PostPositionRecord;
  updatePosition: (id: string, x: number, y: number) => void;
}>({
  updatePosition: () => () => {},
});

type Props = {
  children: React.ReactNode;
};

export function PositionProvider({ children }: Props) {
  const { storedValue: state, setValue } =
    useLocalStorage<PostPositionRecord>("post-position");

  const [positions, setPositions] = useState<PostPositionRecord>(state || {});

  const positionState = useRef<PostPositionRecord>(positions);
  const [saveTrigger, setTrigger] = useState(false);

  const updatePosition = useCallback(
    (id: string, x: number, y: number) => {
      setPositions((prev) => {
        const next = { ...prev, [id]: { x, y } };
        positionState.current = next;
        return next;
      });

      if (!saveTrigger) setTrigger(true);
    },
    [saveTrigger],
  );

  // 디바운스된 실제 로컬스토리지 저장
  useDebouncedEffect(() => {
    if (!saveTrigger) return;
    setValue(positionState.current);
    setTrigger(false);
  }, 100);

  return (
    <PositionContext.Provider value={{ positions, updatePosition }}>
      {children}
    </PositionContext.Provider>
  );
}

export function usePostPosition() {
  return useContext(PositionContext);
}
