import { IoMdArrowDropdown } from "react-icons/io";
import { GoPlus } from "react-icons/go";

export default function PostSetting() {
  return (
    <menu className="absolute right-2 top-2 p-2 bg-white rounded-md border-blue-800 border-2 z-50 flex flex-col">
      <li className="p-2 w-full border-b-2">
        <h2 className="font-bold text-xl">Color</h2>
        <div className="flex gap-2 mt-4">
          <input type="color" defaultValue={"#ffd230"} name="background" />
          <input
            type="text"
            defaultValue={"#ffd230"}
            className="bg-neutral-200 rounded-md w-32"
          />
        </div>
      </li>
      <li className="p-2 w-full border-b-2">
        <h2 className="font-bold text-xl">Layout</h2>
        <div className="flex gap-2 mt-4 flex-col">
          <span className="flex justify-between">
            <label htmlFor="width" className="text-gray-600">
              width
            </label>
            <input
              type="text"
              id="width"
              name="width"
              className="bg-neutral-200 rounded-md w-32"
            />
          </span>
          <span className="flex justify-between">
            <label htmlFor="width" className="text-gray-600">
              height
            </label>
            <input
              type="text"
              id="height"
              name="height"
              className="bg-neutral-200 rounded-md w-32"
            />
          </span>
        </div>
      </li>
    </menu>
  );
}
