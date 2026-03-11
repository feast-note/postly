import { IoMdColorPalette } from "react-icons/io";

type Props = {
  onClick: () => void;
};
export default function ColorButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-5 h-5 bg-gray-100 flex justify-center items-center rounded-md"
    >
      <IoMdColorPalette color={"purple"} size={20} />
    </button>
  );
}
