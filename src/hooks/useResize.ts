import { usePost } from "@/context/PostContext";
import { useCallback, useRef } from "react";
import { useScale } from "./useScale";

export type ResizeDirection = "n" | "s" | "w" | "e" | "nw" | "ne" | "se" | "sw";

export const useResize = (id: string) => {
  const targetRef = useRef<HTMLElement>(null);
  const { updateState } = usePost();
  const { scale } = useScale();

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: ResizeDirection) => {
      if (!targetRef.current) return;
      e.stopPropagation();
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = targetRef.current.offsetWidth;
      const startH = targetRef.current.offsetHeight;
      const startL = targetRef.current.offsetLeft;
      const startT = targetRef.current.offsetTop;

      let width,
        height,
        left,
        top = null;

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!targetRef.current) return;
        const deltaX = (moveEvent.clientX - startX) / scale;
        const deltaY = (moveEvent.clientY - startY) / scale;

        // 동쪽(오른쪽)으로 늘리기
        if (direction.includes("e")) {
          width = startW + deltaX;

          targetRef.current.style.width = `${width}px`;
          updateState(id, { size: { width } });
        }
        // 서쪽(왼쪽)으로 늘리기: 위치(left)도 이동해야 함
        if (direction.includes("w")) {
          left = startL + deltaX;
          width = startW - deltaX;

          targetRef.current.style.left = `${left}px`;
          targetRef.current.style.width = `${width}px`;

          updateState(id, { position: { x: left } });
        }
        // 남쪽(아래)으로 늘리기
        if (direction.includes("s")) {
          height = startH + deltaY;
          targetRef.current.style.height = `${height}px`;

          updateState(id, { size: { height } });
        }
        // 북쪽(위)으로 늘리기: 위치(top)도 이동해야 함
        if (direction.includes("n")) {
          top = startT + deltaY;
          height = startH - deltaY;
          targetRef.current.style.top = `${top}px`;
          targetRef.current.style.height = `${height}px`;

          updateState(id, { position: { y: top }, size: { height } });
        }
      };

      const onMouseUp = () => {
        // 최종 변경된 값을 DB/Context에 저장하는 로직을 여기에 추가
        // updatePosition(id, finalX, finalY, finalW, finalH);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [id, scale, updateState],
  );

  return { targetRef, handleResizeStart };
};
