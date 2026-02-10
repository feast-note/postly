import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ value, ...props }: Props) {
  return (
    <button
      {...props}
      className="text-neutral-200 p-2 rounded-md min-w-16 border hover:bg-gray-950 border-gray-400"
    >
      {value}
    </button>
  );
}
