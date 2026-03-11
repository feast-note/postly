export type Post = {
  id: string;
  content?: string;
  zIndex: number;
};

export type Position = {
  x?: number;
  y?: number;
};

export type Size = {
  width?: number;
  height?: number;
};

export type Color = {
  color?: string;
};

export type BoardPost = Post & {
  position?: Position;
} & Size &
  Color;
