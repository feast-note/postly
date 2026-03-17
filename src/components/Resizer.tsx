import { ResizeDirection } from "@/hooks/resize";

type Props = {
  onResize: (e: React.MouseEvent, direction: ResizeDirection) => void;
};
export default function Resizer({ onResize }: Props) {
  return (
    <>
      <>
        {/* 변 (Edges) */}
        <div
          className={`absolute cursor-nwse-resize p-2 z-50`}
          onMouseDown={(e) => onResize(e, "nw")}
        />
        <div
          className="right-0 absolute cursor-nesw-resize p-2 z-50"
          onMouseDown={(e) => onResize(e, "ne")}
        />
        <div
          className="bottom-0 right-0 absolute cursor-nwse-resize p-2 z-50"
          onMouseDown={(e) => onResize(e, "se")}
        />
        <div
          className="bottom-0 left-0 absolute cursor-nesw-resize p-2 z-50"
          onMouseDown={(e) => onResize(e, "sw")}
        />

        {/* 모서리 (Corners) */}
        <div
          className="absolute p-2 cursor-ns-resize w-full"
          onMouseDown={(e) => onResize(e, "n")}
        />
        <div
          className="absolute left-0 p-2 cursor-ew-resize h-full"
          onMouseDown={(e) => onResize(e, "w")}
        />
        <div
          className="absolute right-0 p-2 cursor-ew-resize h-full"
          onMouseDown={(e) => onResize(e, "e")}
        />
        <div
          className="absolute bottom-0 p-2 cursor-ns-resize w-full"
          onMouseDown={(e) => onResize(e, "s")}
        />
      </>
    </>
  );
}
