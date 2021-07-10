import { Ray } from "./ray.ts";
import { dot, length2, minus, Vec3 } from "./vec.ts";

export type Shape = {
  intersect: (ray: Ray) => number[];
  normal: (point: Vec3) => Vec3;
};

export type Plane = {
  position: Vec3;
  normal: Vec3;
};

export type Sphere = {
  position: Vec3;
  radius: number;
};

export function createPlane(plane: Plane): Shape {
  return {
    normal: () => plane.normal,
    intersect: (ray) => {
      const dDotN = dot(plane.normal, ray.direction);
      if (dDotN === 0) return [];
      const delta = minus(plane.position, ray.position);
      return [dot(delta, plane.normal) / dDotN];
    },
  };
}

export function createSphere(sphere: Sphere): Shape {
  return {
    normal: (position) => minus(position, sphere.position),
    intersect: (ray) => {
      // Compute coefficients for ray-sphere intersection polynomial: at^2 + bt + c
      const position = minus(ray.position, sphere.position);
      const a = length2(ray.direction);
      const b = 2 * dot(position, ray.direction);
      const c = length2(position) - sphere.radius * sphere.radius;
      const discriminant = b * b - 4 * a * c;

      // Compute the solution for t given the value for the root.
      const t = (root: number) => -(b + root) / (2 * a);

      // No intersection.
      if (discriminant < 0) return [];

      // One intersection.
      if (discriminant == 0) return [t(0)];

      // Two intersections.
      const root = Math.sqrt(discriminant);
      return [t(root), t(-root)];
    },
  };
}
