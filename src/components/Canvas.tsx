import { useTransform } from "@/context/TransformContext";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};
export default function Canvas({ children }: Props) {
  const { position, scale } = useTransform();
  return (
    <div
      id="canvas"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        transformOrigin: "0 0",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
      <div
        className="pointer-events-none absolute -top-1250 -left-1250 w-2500 h-2500 opacity-20"
        style={{
          background: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}
