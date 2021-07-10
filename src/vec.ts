export type Vec3<X = number> = [X, X, X];

export function isZero(v: Vec3): boolean {
  return v[0] === 0 && v[1] === 0 && v[2] === 0;
}

export function plus([a1, a2, a3]: Vec3, [b1, b2, b3]: Vec3): Vec3 {
  return [a1 + b1, a2 + b2, a3 + b3];
}

export function negate([x, y, z]: Vec3): Vec3 {
  return [-x, -y, -z];
}

export function minus(a: Vec3, b: Vec3): Vec3 {
  return plus(a, negate(b));
}

export function times([a1, a2, a3]: Vec3, [b1, b2, b3]: Vec3): Vec3 {
  return [a1 * b1, a2 * b2, a3 * b3];
}

export function mul(v: Vec3, t: number): Vec3 {
  return times(v, [t, t, t]);
}

export function div(v: Vec3, t: number): Vec3 {
  return mul(v, 1 / t);
}

export function innerSum([x, y, z]: Vec3): number {
  return x + y + z;
}

export function dot(a: Vec3, b: Vec3): number {
  return innerSum(times(a, b));
}

export function reflect(v: Vec3, n: Vec3): Vec3 {
  return minus(v, mul(n, 2 * dot(v, n)));
}

export function refract(v: Vec3, n: Vec3, ior: number): Vec3 {
  const ci = -dot(v, n);
  const eta = ci < 0 ? ior : 1 / ior;
  const c2 = 1 - eta * eta * (1 - ci * ci);
  if (c2 < 0) return [0, 0, 0]; // total internal reflection
  const c2root = Math.sqrt(c2);
  return plus(mul(v, eta), mul(n, eta * ci - c2root));
}

export function angle(a: Vec3, b: Vec3): number {
  return Math.acos(dot(a, b));
}

export function length2(v: Vec3): number {
  return dot(v, v);
}

export function length(v: Vec3): number {
  return Math.sqrt(length2(v));
}

export function normalize(v: Vec3): Vec3 {
  return isZero(v) ? v : div(v, length(v));
}
