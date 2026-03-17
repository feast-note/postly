"use client";
import { useDebouncedEffect } from "@/hooks/debounce-effect";
import { useLocalStorage } from "@/hooks/localstorage";
import { LocalPost } from "@/model/post";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type PostState = Record<string, LocalPost>;

const PostContext = createContext<{
  postState?: PostState;
  updatePosition: (id: string, x: number, y: number) => void;
  removePost: (id: string) => void;
  updateState: (id: string, updates: LocalPost) => void;
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

  const updateState = useCallback((id: string, updates: LocalPost) => {
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
