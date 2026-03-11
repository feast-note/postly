import Editor from "./Editor";

type Props = {
  id: string;
  content?: string;
};

export default function PostContentForm({ id, content }: Props) {
  return <Editor content={content} id={id} />;
}
