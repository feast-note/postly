import { ReactNode } from "react";
import { createPortal } from "react-dom";
type Props = {
  children: ReactNode;
  target: string;
};
export default function ModalPortal({ children, target }: Props) {
  if (typeof window === "undefined") return null;

  const node = document.getElementById(target) as Element;
  return createPortal(children, node);
}
