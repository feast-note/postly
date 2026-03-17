import { useEffect } from "react";

export const useDebouncedEffect = (func: () => void, sec: number) => {
  useEffect(() => {
    const hander = setTimeout(() => {
      func();
    }, sec);
    return () => {
      clearTimeout(hander);
    };
  }, [func, sec]);
};
