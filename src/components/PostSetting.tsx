import { Post } from "@/service/post";

type Props = {
  selected: Post | null;
};

export default function PostSetting({ selected }: Props) {
  return (
    <menu className="absolute w-48 right-2 top-16  bg-white z-50 flex flex-col">
      {selected ? (
        <>
          <h2 className="text-md font-bold w-full text-center pt-2">Design</h2>
          <li className="p-2 w-full border-b-[0.3px] border-gray-200">
            <h3 className="font-bold text-d">Color</h3>
            <div className="flex gap-2 mt-4">
              <input type="color" defaultValue={"#ffd230"} name="background" />
              <input
                type="text"
                defaultValue={"#ffd230"}
                className="bg-neutral-200 rounded-md w-16"
              />
            </div>
          </li>
          <li className="p-2 w-full border-b-2">
            <h2 className="font-bold text-md">Layout</h2>
            <div className="flex gap-2 mt-4 flex-col">
              <span className="flex justify-between">
                <label htmlFor="width" className="text-gray-600 text-sm">
                  width
                </label>
                <input
                  type="text"
                  id="width"
                  name="width"
                  className="bg-neutral-200 rounded-md w-16"
                />
              </span>
              <span className="flex justify-between">
                <label htmlFor="width" className="text-gray-600 text-sm">
                  height
                </label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  className="bg-neutral-200 rounded-md w-16"
                />
              </span>
            </div>
          </li>
        </>
      ) : (
        <li className="w-48 h-58 flex justify-center items-center bg-linear-60 from-blue-600 to-purple-500">
          <h2 className="font-bold text-lg text-white">create post</h2>
        </li>
      )}
    </menu>
  );
}
