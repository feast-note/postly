import { CgClose } from "react-icons/cg";

type Props = {
  onClick: () => void;
};

export default function CloseButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-5 h-5 flex justify-center items-center rounded-md bg-red-500 hover:point-cursor hover:bg-red-700"
    >
      <CgClose />
    </button>
  );
}
