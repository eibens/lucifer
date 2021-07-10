import { between, Ray } from "./ray.ts";
import { Image, iterateImage } from "./image.ts";
import { Color } from "./color.ts";
import { Vec3 } from "./vec.ts";

export type Camera = {
  offset: number;
  focalDistance: number;
};

export function createCamera(camera: Camera) {
  return (image: Image, trace: (ray: Ray) => Color) => {
    if (image.width != image.height) {
      throw new Error(
        "Not implemented: camera does not support non-square images.",
      );
    }

    const resolution = image.width;
    const cameraPos: Vec3 = [0, 0, camera.offset];

    iterateImage(image, (i, j) => {
      const x = i / resolution * 2 - 1;
      const y = j / resolution * 2 - 1;
      const pos: Vec3 = [x, y, camera.offset + camera.focalDistance];
      const ray = between(cameraPos, pos);
      image.set(i, j, trace(ray));
    });
  };
}
