/// <reference lib="dom"/>
import { createCamera } from "./src/camera.ts";
import { Color, toRgbString } from "./src/color.ts";
import { Image } from "./src/image.ts";
import { createExampleScene } from "./src/scene.ts";
import { trace } from "./src/tracer.ts";

new WebSocket("ws://localhost:1234")
  .addEventListener("message", () => window.location.reload());

document.body.innerText = "Rendering might take a while...";

setTimeout(() => {
  render({
    depth: 2,
    size: 512,
  });
}, 100);

function render(options: {
  depth: number;
  size: number;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = options.size;
  canvas.height = options.size;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    const scene = createExampleScene();
    const image: Image = Object.assign(canvas, {
      set: (x: number, y: number, color: Color) => {
        ctx.fillStyle = toRgbString(color);
        ctx.fillRect(x, y, 1, 1);
      },
    });
    const camera = createCamera({
      offset: -4,
      focalDistance: 1,
    });

    camera(image, (ray) => trace(scene, ray, options.depth));
  }

  document.body.innerText = "";
  document.body.appendChild(canvas);
}
