import AddPost from "./AddPost";

export default function ToolBar() {
  return (
    <menu className="absolute bottom-2 left-[48%] bg-slate-900 p-2 rounded-md z-100 flex gap-3">
      <AddPost />
    </menu>
  );
}
