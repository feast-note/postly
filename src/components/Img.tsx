import { urlFor } from "@/service/sanityImageUrl";
import { SanityImageObject } from "@sanity/image-url";

type Props = {
  image: SanityImageObject;
};

export default function Img({ image }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={urlFor(image).width(300).height(200).url()}
      // Depending on your schema, you may need to adjust the alt text location
      // and update types to match your schema.
      alt={"Image"}
      draggable="false"
    />
  );
}
