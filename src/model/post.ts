export type Post = {
  id: string;
  title?: string;
  content?: string;
  zIndex: number;
  color: string;
  image?: string;
  width?: number;
  height?: number;
  position?: { x?: number; y?: number };
};
