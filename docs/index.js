function isZero(v) {
    return v[0] === 0 && v[1] === 0 && v[2] === 0;
}
function plus([a1, a2, a3], [b1, b2, b3]) {
    return [
        a1 + b1,
        a2 + b2,
        a3 + b3
    ];
}
function negate([x, y, z]) {
    return [
        -x,
        -y,
        -z
    ];
}
function minus(a, b) {
    return plus(a, negate(b));
}
function times([a1, a2, a3], [b1, b2, b3]) {
    return [
        a1 * b1,
        a2 * b2,
        a3 * b3
    ];
}
function mul(v, t) {
    return times(v, [
        t,
        t,
        t
    ]);
}
function div(v, t) {
    return mul(v, 1 / t);
}
function innerSum([x, y, z]) {
    return x + y + z;
}
function dot(a, b) {
    return innerSum(times(a, b));
}
function reflect(v, n) {
    return minus(v, mul(n, 2 * dot(v, n)));
}
function length2(v) {
    return dot(v, v);
}
function length(v) {
    return Math.sqrt(length2(v));
}
function normalize(v) {
    return isZero(v) ? v : div(v, length(v));
}
function between(a, b) {
    return {
        position: a,
        direction: minus(b, a)
    };
}
function evaluate(ray, t) {
    return plus(ray.position, mul(ray.direction, t));
}
function iterateImage(image, func) {
    for(let i = 0; i < image.width; i++){
        for(let j = 0; j < image.height; j++){
            func(i, j);
        }
    }
}
function createCamera(camera) {
    return (image, trace)=>{
        if (image.width != image.height) {
            throw new Error("Not implemented: camera does not support non-square images.");
        }
        const resolution = image.width;
        const cameraPos = [
            0,
            0,
            camera.offset
        ];
        iterateImage(image, (i, j)=>{
            const x = i / resolution * 2 - 1;
            const y = j / resolution * 2 - 1;
            const pos = [
                x,
                y,
                camera.offset + camera.focalDistance
            ];
            const ray = between(cameraPos, pos);
            image.set(i, j, trace(ray));
        });
    };
}
function toBytes([r, g, b]) {
    const toByte = (x)=>Math.round(255 * Math.max(0, Math.min(1, x)))
    ;
    return [
        toByte(r),
        toByte(g),
        toByte(b), 
    ];
}
function toRgbString(color) {
    const [r, g, b] = toBytes(color);
    return `rgb(${r}, ${g}, ${b})`;
}
function createPlane(plane) {
    return {
        normal: ()=>plane.normal
        ,
        intersect: (ray)=>{
            const dDotN = dot(plane.normal, ray.direction);
            if (dDotN === 0) return [];
            const delta = minus(plane.position, ray.position);
            return [
                dot(delta, plane.normal) / dDotN
            ];
        }
    };
}
function createSphere(sphere) {
    return {
        normal: (position)=>minus(position, sphere.position)
        ,
        intersect: (ray)=>{
            const position = minus(ray.position, sphere.position);
            const a = length2(ray.direction);
            const b = 2 * dot(position, ray.direction);
            const c = length2(position) - sphere.radius * sphere.radius;
            const discriminant = b * b - 4 * a * c;
            const t = (root)=>-(b + root) / (2 * a)
            ;
            if (discriminant < 0) return [];
            if (discriminant == 0) return [
                t(0)
            ];
            const root = Math.sqrt(discriminant);
            return [
                t(root),
                t(-root)
            ];
        }
    };
}
function createExampleScene() {
    const reflective = {
        color: [
            0,
            0,
            0
        ],
        reflection: 0.4
    };
    const white = {
        color: [
            1,
            1,
            1
        ],
        reflection: 0.1
    };
    const red = {
        color: [
            1,
            0,
            0
        ],
        reflection: 0.1
    };
    const green = {
        color: [
            0,
            1,
            0
        ],
        reflection: 0.1
    };
    const wall = 5;
    const wallData = [
        [
            [
                -5,
                0,
                0
            ],
            [
                +1,
                0,
                0
            ],
            red
        ],
        [
            [
                +5,
                0,
                0
            ],
            [
                -1,
                0,
                0
            ],
            green
        ],
        [
            [
                0,
                -5,
                0
            ],
            [
                0,
                +1,
                0
            ],
            white
        ],
        [
            [
                0,
                +5,
                0
            ],
            [
                0,
                -1,
                0
            ],
            white
        ],
        [
            [
                0,
                0,
                -5
            ],
            [
                0,
                0,
                +1
            ],
            white
        ],
        [
            [
                0,
                0,
                +5
            ],
            [
                0,
                0,
                -1
            ],
            white
        ], 
    ];
    const walls = wallData.map(([position, normal, material])=>({
            material,
            shape: createPlane({
                position,
                normal
            })
        })
    );
    const sphereData = [
        [
            [
                2,
                0,
                0
            ],
            0.8
        ],
        [
            [
                -2,
                -1,
                0
            ],
            0.8
        ],
        [
            [
                0,
                2,
                2
            ],
            2
        ], 
    ];
    const spheres = sphereData.map(([position, radius])=>({
            material: reflective,
            shape: createSphere({
                position,
                radius
            })
        })
    );
    const lightData = [
        [
            [
                0,
                -5 + 1,
                0
            ],
            [
                20,
                20,
                20
            ]
        ],
        [
            [
                -5 + 1,
                5 - 1,
                5 - 1
            ],
            mul([
                1,
                1,
                0.5
            ], 5)
        ],
        [
            [
                5 - 1,
                5 - 1,
                5 - 1
            ],
            mul([
                0.5,
                0.8,
                1
            ], 5)
        ], 
    ];
    const lights = lightData.map(([position, color])=>({
            position,
            color
        })
    );
    return {
        lights,
        models: [
            ...walls,
            ...spheres
        ],
        background: [
            0,
            0,
            0
        ]
    };
}
function trace(scene, ray, depth) {
    if (depth <= 0) return [
        0,
        0,
        0
    ];
    const result = intersect(ray, scene);
    if (!result) return scene.background;
    const [model, t] = result;
    const hit = evaluate(ray, t - 0.001);
    const normal = model.shape.normal(hit);
    const diffuseLight = scene.lights.map((light)=>{
        const shadowRay = between(hit, light.position);
        const shadowResult = intersect(shadowRay, scene);
        const shadowHit = shadowResult ? shadowResult[1] : Infinity;
        if (shadowHit < 1) return [
            0,
            0,
            0
        ];
        const lightFalloff = 1 / length2(shadowRay.direction);
        const attenuation = dot(normal, normalize(shadowRay.direction));
        return mul(times(light.color, model.material.color), lightFalloff * attenuation);
    }).reduce((a, b)=>plus(a, b)
    , [
        0,
        0,
        0
    ]);
    const r = model.material.reflection;
    let reflectedLight = [
        0,
        0,
        0
    ];
    if (r > 0) {
        const reflected = reflect(ray.direction, normal);
        reflectedLight = trace(scene, {
            position: hit,
            direction: reflected
        }, depth - 1);
    }
    return plus(mul(diffuseLight, 1 - r), mul(reflectedLight, r));
}
function intersect(ray, scene) {
    const candidates = scene.models.flatMap((model)=>model.shape.intersect(ray).map((t)=>[
                model,
                t
            ]
        )
    ).filter(([_, t])=>t > 0
    );
    return minBy(candidates, ([_, t])=>t
    );
}
function minBy(array, map) {
    if (array.length === 0) return;
    const weights = array.map(map);
    const min = weights.reduce((a, b)=>Math.min(a, b)
    , Infinity);
    const index = weights.indexOf(min);
    return array[index];
}
new WebSocket("ws://localhost:1234").addEventListener("message", ()=>window.location.reload()
);
document.body.innerText = "Rendering might take a while...";
setTimeout(()=>{
    render({
        depth: 2,
        size: 512
    });
}, 100);
function render(options) {
    const canvas = document.createElement("canvas");
    canvas.width = options.size;
    canvas.height = options.size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        const scene = createExampleScene();
        const image = Object.assign(canvas, {
            set: (x, y, color)=>{
                ctx.fillStyle = toRgbString(color);
                ctx.fillRect(x, y, 1, 1);
            }
        });
        const camera = createCamera({
            offset: -4,
            focalDistance: 1
        });
        camera(image, (ray)=>trace(scene, ray, options.depth)
        );
    }
    document.body.innerText = "";
    document.body.appendChild(canvas);
}
