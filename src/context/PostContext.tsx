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

type PostStateObj = {
  position?: { x?: number; y?: number };
  size?: { width?: number; height?: number };
  color?: string;
};

type PostState = Record<string, PostStateObj>;

const PostContext = createContext<{
  postState?: PostState;
  updatePosition: (id: string, x: number, y: number) => void;
  removePost: (id: string) => void;
  updateState: (id: string, updates: PostStateObj) => void;
}>({
  updatePosition: () => () => {},
  removePost: () => {},
  updateState: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function PostProvider({ children }: Props) {
  const { storedValue: state, setValue } = useLocalStorage<PostState>("posts");

  const [postState, setPostState] = useState<PostState>(state || {});

  const positionState = useRef<PostState>(postState);
  const [saveTrigger, setTrigger] = useState(false);

  const updatePosition = useCallback(
    (id: string, x: number, y: number) => {
      setPostState((prev) => {
        const next = { ...prev, [id]: { ...prev[id], position: { x, y } } };
        positionState.current = next;
        return next;
      });

      if (!saveTrigger) setTrigger(true);
    },
    [saveTrigger],
  );

  const updateState = useCallback((id: string, updates: PostStateObj) => {
    setPostState((prev) => {
      const prevItem = prev[id] || {
        position: { x: 0, y: 0 },
        size: { width: 360, height: 360 },
        color: "#fef08a",
      };
      const next = {
        ...prev,
        [id]: {
          position: {
            ...prevItem.position,
            ...updates.position,
          },
          size: {
            ...prevItem.size,
            ...updates.size,
          },
          color: updates.color || prevItem.color,
        },
      };
      positionState.current = next;
      return next;
    });
  }, []);

  const removePost = useCallback(
    (id: string) =>
      setPostState((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      }),
    [],
  );

  // 디바운스된 실제 로컬스토리지 저장
  useDebouncedEffect(() => {
    if (!saveTrigger) return;
    setValue(positionState.current);
    setTrigger(false);
  }, 100);

  return (
    <PostContext.Provider
      value={{ postState, updatePosition, removePost, updateState }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  return useContext(PostContext);
}
