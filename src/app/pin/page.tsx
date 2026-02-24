import Board from "@/components/Board";
import { AddModeProvider } from "@/context/AddModeContext";
import { TransformProvider } from "@/context/TransformContext";

export default function PinPage() {
  return (
    <TransformProvider>
      <AddModeProvider>
        <Board />
      </AddModeProvider>
    </TransformProvider>
  );
}
