import { ReactNode } from "react";
type Props = {
  children: ReactNode;
};
export default function PostSetting({ children }: Props) {
  return (
    <section>
      <h2 className="text-md font-bold w-full text-center pt-2">Design</h2>
      {children}
    </section>
  );
}
