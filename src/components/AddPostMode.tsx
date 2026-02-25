import { useAddMode } from "@/context/AddModeContext";

export default function AddPostMode() {
  const { isAddMode, target } = useAddMode();
  return <>{isAddMode && <div ref={target} className="absolute"></div>}</>;
}
