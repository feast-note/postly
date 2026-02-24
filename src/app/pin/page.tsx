import Board from "@/components/Board";
import { AddModeProvider } from "@/context/AddModeContext";
import { DragModeProvider } from "@/context/DragModeContext";
import { TransformProvider } from "@/context/TransformContext";

export default function PinPage() {
  return (
    <TransformProvider>
      <DragModeProvider>
        <AddModeProvider>
          <Board />
        </AddModeProvider>
      </DragModeProvider>
    </TransformProvider>
  );
}
