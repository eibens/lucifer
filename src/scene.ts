import { Color } from "./color.ts";
import { createPlane, createSphere, Shape } from "./shape.ts";
import { mul, Vec3 } from "./vec.ts";

export type Scene = {
  background: Color;
  models: Model[];
  lights: Light[];
};

export type Material = {
  color: [number, number, number];
  reflection: number;
};

export type Model = {
  shape: Shape;
  material: Material;
};

export type Light = {
  position: Vec3;
  color: Color;
};

export function createExampleScene(): Scene {
  // Materials
  const reflective: Material = {
    color: [0, 0, 0],
    reflection: 0.4,
  };
  const white: Material = {
    color: [1, 1, 1],
    reflection: 0.1,
  };
  const red: Material = {
    color: [1, 0, 0],
    reflection: 0.1,
  };
  const green: Material = {
    color: [0, 1, 0],
    reflection: 0.1,
  };

  // Walls
  const wall = 5;
  const wallData: [Vec3, Vec3, Material][] = [
    [[-wall, 0, 0], [+1, 0, 0], red],
    [[+wall, 0, 0], [-1, 0, 0], green],
    [[0, -wall, 0], [0, +1, 0], white],
    [[0, +wall, 0], [0, -1, 0], white],
    [[0, 0, -wall], [0, 0, +1], white],
    [[0, 0, +wall], [0, 0, -1], white],
  ];
  const walls: Model[] = wallData.map(([position, normal, material]) => ({
    material,
    shape: createPlane({
      position,
      normal,
    }),
  }));

  // Spheres
  const sphereData: [Vec3, number][] = [
    [[2, 0, 0], 0.8],
    [[-2, -1, 0], 0.8],
    [[0, 2, 2], 2],
  ];
  const spheres: Model[] = sphereData.map(([position, radius]) => ({
    material: reflective,
    shape: createSphere({
      position,
      radius,
    }),
  }));

  // Lights
  const lightData: [Vec3, Color][] = [
    [[0, -wall + 1, 0], [20, 20, 20]],
    [[-wall + 1, wall - 1, wall - 1], mul([1, 1, 0.5], 5)],
    [[wall - 1, wall - 1, wall - 1], mul([0.5, 0.8, 1], 5)],
  ];
  const lights: Light[] = lightData.map(([position, color]) => ({
    position,
    color,
  }));

  // Scene
  return {
    lights,
    models: [...walls, ...spheres],
    background: [0, 0, 0],
  };
}
