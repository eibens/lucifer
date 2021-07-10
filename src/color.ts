import { Vec3 } from "./vec.ts";

export type Color = Vec3;

export function toBytes([r, g, b]: Color): Vec3 {
  const toByte = (x: number) => Math.round(255 * Math.max(0, Math.min(1, x)));
  return [
    toByte(r),
    toByte(g),
    toByte(b),
  ];
}

export function toRgbString(color: Color): string {
  const [r, g, b] = toBytes(color);
  return `rgb(${r}, ${g}, ${b})`;
}
