type Props = {
  image: string;
};

export default function Img({ image }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image}
      // Depending on your schema, you may need to adjust the alt text location
      // and update types to match your schema.
      alt={"Image"}
      draggable="false"
    />
  );
}
