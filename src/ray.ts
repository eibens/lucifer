import { minus, mul, plus, Vec3 } from "./vec.ts";

export type Ray = {
  position: Vec3;
  direction: Vec3;
};

export function between(a: Vec3, b: Vec3): Ray {
  return {
    position: a,
    direction: minus(b, a),
  };
}

export function evaluate(ray: Ray, t: number) {
  return plus(ray.position, mul(ray.direction, t));
}
