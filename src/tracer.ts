import { Color } from "./color.ts";
import { between, evaluate, Ray } from "./ray.ts";
import { Model, Scene } from "./scene.ts";
import { reflect } from "./vec.ts";
import { Vec3 } from "./vec.ts";
import { plus } from "./vec.ts";
import { mul } from "./vec.ts";
import { times } from "./vec.ts";
import { length2 } from "./vec.ts";
import { dot } from "./vec.ts";
import { normalize } from "./vec.ts";

export function trace(scene: Scene, ray: Ray, depth: number): Color {
  if (depth <= 0) return [0, 0, 0];

  // Intersect ray with all objects and return closest positive hit.
  const result = intersect(ray, scene);
  if (!result) return scene.background;
  const [model, t] = result;
  const hit = evaluate(ray, t - 0.001);
  const normal = model.shape.normal(hit);

  // Collect diffuse light by summing up contributions from each light source
  const diffuseLight = scene.lights.map((light) => {
    const shadowRay = between(hit, light.position);
    const shadowResult = intersect(shadowRay, scene);
    const shadowHit = shadowResult ? shadowResult[1] : Infinity;

    // Shadow ray hits object before light source
    if (shadowHit < 1) return [0, 0, 0] as Vec3;

    const lightFalloff = 1 / length2(shadowRay.direction);
    const attenuation = dot(normal, normalize(shadowRay.direction));
    return mul(
      times(light.color, model.material.color),
      lightFalloff * attenuation,
    );
  }).reduce((a, b) => plus(a, b), [0, 0, 0] as Vec3);

  // Trace reflection ray if the material is reflective
  const r = model.material.reflection;
  let reflectedLight: Vec3 = [0, 0, 0];
  if (r > 0) {
    const reflected = reflect(ray.direction, normal);
    reflectedLight = trace(scene, {
      position: hit,
      direction: reflected,
    }, depth - 1);
  }

  // Mix diffuse and reflected light
  return plus(
    mul(diffuseLight, 1 - r),
    mul(reflectedLight, r),
  );
}

type Candidate = [Model, number];

function intersect(ray: Ray, scene: Scene): Candidate | undefined {
  const candidates = scene.models
    .flatMap((model) =>
      model.shape.intersect(ray).map((t) => [model, t] as Candidate)
    )
    .filter(([_, t]) => t > 0);

  return minBy(candidates, ([_, t]) => t);
}

function minBy<X>(array: X[], map: (x: X) => number): X | undefined {
  if (array.length === 0) return;
  const weights = array.map(map);
  const min = weights.reduce((a, b) => Math.min(a, b), Infinity);
  const index = weights.indexOf(min);
  return array[index];
}
