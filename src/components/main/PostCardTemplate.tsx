type Props = {
  text: string;
  color: string;
};
export default function PostCardTemplate({ text, color }: Props) {
  return (
    <div
      className={`w-48 h-48 bg-[#${color}] p-2 shadow-lg flex justify-center items-center`}
      draggable
    >
      <h2 className="text-6xl font-bold p-2 text-center text-white">{text}</h2>
    </div>
  );
}
