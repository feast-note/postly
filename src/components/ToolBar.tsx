type Props = {
  children: React.ReactNode;
};
export default function ToolBar({ children }: Props) {
  return (
    <menu className="absolute bottom-2 left-[48%] bg-slate-900 p-2 rounded-md z-100 flex gap-3">
      {/* <li>
        <AddPost />
      </li>
      <li>
        <button className="flex items-center text-gray-300 border-[0.1px] p-1 rounded-sm border-gray-300 hover:bg-neutral-950">
          <RxGroup />
        </button>
      </li> */}
      {children}
    </menu>
  );
}
