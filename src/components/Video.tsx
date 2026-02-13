import { ComponentPropsWithoutRef } from "react";

type Props = {
  width: string;
  height: string;
  src: string;
} & ComponentPropsWithoutRef<"video">;
export default function Video({ width, height, src, ...props }: Props) {
  return (
    <video width={width} height={height} {...props}>
      <source src={src} />
    </video>
  );
}
