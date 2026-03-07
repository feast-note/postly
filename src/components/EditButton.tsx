import { MdModeEditOutline } from "react-icons/md";

type Props = {
  onClick: () => void;
};
export default function EditButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-5 h-5 flex justify-center items-center rounded-md bg-blue-300 hover:point-cursor hover:bg-blue-500 opacity-0 group-hover:opacity-100"
    >
      <MdModeEditOutline />
    </button>
  );
}
