// Rescales a GLB to real-world size for AR (ar-scale="fixed" uses meters) and rests it on y=0,
// centered on x/z. No dependencies: it only wraps the scene in a new root node.
//
// Usage: node scripts/normalize-glb.mjs <in.glb> <out.glb> <size-in-meters> [width|height]
//   width  (default): largest horizontal side (x or z) becomes <size>  — pizzas, plates, sandwiches
//   height:          vertical size becomes <size>                     — glasses, drinks
import { readFileSync, writeFileSync } from "node:fs";

const [input, output, sizeArg, mode = "width"] = process.argv.slice(2);
if (!input || !output || !sizeArg) {
  console.error("Usage: node scripts/normalize-glb.mjs <in.glb> <out.glb> <meters> [width|height]");
  process.exit(1);
}
const target = Number(sizeArg);

// --- GLB container -------------------------------------------------------------------------
const buf = readFileSync(input);
if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("Not a GLB file");
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8"));
const rest = buf.subarray(20 + jsonLen); // BIN chunk (header included), kept as is

// --- 4x4 column-major matrices ---------------------------------------------------------------
const mul = (a, b) => {
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
};
const trs = ({ translation: t = [0, 0, 0], rotation: q = [0, 0, 0, 1], scale: s = [1, 1, 1] }) => {
  const [x, y, z, w] = q;
  return [
    (1 - 2 * (y * y + z * z)) * s[0], 2 * (x * y + z * w) * s[0], 2 * (x * z - y * w) * s[0], 0,
    2 * (x * y - z * w) * s[1], (1 - 2 * (x * x + z * z)) * s[1], 2 * (y * z + x * w) * s[1], 0,
    2 * (x * z + y * w) * s[2], 2 * (y * z - x * w) * s[2], (1 - 2 * (x * x + y * y)) * s[2], 0,
    t[0], t[1], t[2], 1,
  ];
};
const apply = (m, [x, y, z]) => [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]];
const I = trs({});

// --- World-space bounds from POSITION accessor min/max (required by the glTF spec) -----------
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
const visit = (index, parent) => {
  const node = gltf.nodes[index];
  const world = mul(parent, node.matrix ?? trs(node));
  if (node.mesh !== undefined) {
    for (const prim of gltf.meshes[node.mesh].primitives) {
      const acc = gltf.accessors[prim.attributes.POSITION];
      if (!acc?.min || !acc?.max) continue;
      for (let i = 0; i < 8; i++) {
        const corner = [i & 1 ? acc.max[0] : acc.min[0], i & 2 ? acc.max[1] : acc.min[1], i & 4 ? acc.max[2] : acc.min[2]];
        apply(world, corner).forEach((v, a) => { min[a] = Math.min(min[a], v); max[a] = Math.max(max[a], v); });
      }
    }
  }
  for (const child of node.children ?? []) visit(child, world);
};
const scene = gltf.scenes[gltf.scene ?? 0];
scene.nodes.forEach((n) => visit(n, I));
if (!Number.isFinite(min[0])) throw new Error("No mesh bounds found");

const dims = max.map((v, a) => v - min[a]);
const current = mode === "height" ? dims[1] : Math.max(dims[0], dims[2]);
const s = target / current;

// --- Wrap the scene in a scaled, re-centered root node ---------------------------------------
gltf.nodes.push({
  name: "ar-normalize",
  scale: [s, s, s],
  translation: [-((min[0] + max[0]) / 2) * s, -min[1] * s, -((min[2] + max[2]) / 2) * s],
  children: scene.nodes,
});
scene.nodes = [gltf.nodes.length - 1];

// --- Write GLB ------------------------------------------------------------------------------
let json = Buffer.from(JSON.stringify(gltf), "utf8");
const pad = (4 - (json.length % 4)) % 4;
json = Buffer.concat([json, Buffer.alloc(pad, 0x20)]);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(20 + json.length + rest.length, 8);
header.writeUInt32LE(json.length, 12);
header.writeUInt32LE(0x4e4f534a, 16);
writeFileSync(output, Buffer.concat([header, json, rest]));

const out = dims.map((d) => +(d * s * 100).toFixed(1));
console.log(`${output}: ${out[0]} × ${out[1]} × ${out[2]} cm (w × h × d), ${(Buffer.byteLength(readFileSync(output)) / 1024).toFixed(0)} KB`);
