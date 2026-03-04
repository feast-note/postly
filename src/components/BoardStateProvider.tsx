import { ReactNode } from "react";
import BindProvider from "./BindProvider";
import { TransformProvider } from "@/context/TransformContext";
import { AddModeProvider } from "@/context/AddModeContext";
import { PositionProvider } from "@/context/PositionContext";
import { DragModeProvider } from "@/context/DragModeContext";

type Props = {
  children: ReactNode;
};
export default function BoardStateProvider({ children }: Props) {
  return (
    <BindProvider
      providers={[
        AddModeProvider,
        PositionProvider,
        DragModeProvider,
        TransformProvider,
      ]}
    >
      {children}
    </BindProvider>
  );
}
