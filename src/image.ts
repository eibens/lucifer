import { Color } from "./color.ts";

export type Image = Readonly<{
  set: (x: number, y: number, color: Color) => void;
  width: number;
  height: number;
}>;

export function iterateImage(
  image: Image,
  func: (i: number, j: number) => void,
) {
  for (let i = 0; i < image.width; i++) {
    for (let j = 0; j < image.height; j++) {
      func(i, j);
    }
  }
}
