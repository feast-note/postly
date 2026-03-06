import { ReactNode } from "react";
import BindProvider from "./BindProvider";
import { TransformProvider } from "@/context/TransformContext";
import { PositionProvider } from "@/context/PositionContext";
import { SelectProvider } from "@/context/SelectContext";

type Props = {
  children: ReactNode;
};
export default function BoardStateProvider({ children }: Props) {
  return (
    <BindProvider
      providers={[PositionProvider, TransformProvider, SelectProvider]}
    >
      {children}
    </BindProvider>
  );
}
