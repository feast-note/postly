export type Post = {
  id: string;
  content?: string;
  zIndex: number;
  color: string;
  image?: string;
  width?: number;
  height?: number;
};

export type Position = {
  x: number;
  y: number;
};

export type BoardPost = Post & {
  position?: Position;
};
