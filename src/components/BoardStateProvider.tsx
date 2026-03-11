import { ReactNode } from "react";
import BindProvider from "./BindProvider";
import { TransformProvider } from "@/context/TransformContext";
import { PostProvider } from "@/context/PostContext";
import { SelectProvider } from "@/context/SelectContext";

type Props = {
  children: ReactNode;
};
export default function BoardStateProvider({ children }: Props) {
  return (
    <BindProvider providers={[PostProvider, TransformProvider, SelectProvider]}>
      {children}
    </BindProvider>
  );
}
