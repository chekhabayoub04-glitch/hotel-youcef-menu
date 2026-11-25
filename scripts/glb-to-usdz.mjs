// Converts GLB models to USDZ for iPhone/iPad AR Quick Look, so tapping "Voir sur ta table"
// opens the camera instantly (no in-browser conversion). Real-world scale is kept (1 unit = 1 m)
// and the model is anchored to a horizontal plane (the table).
//
// Usage: node scripts/glb-to-usdz.mjs public/models/*.glb   → writes the .usdz next to each .glb
// Note: models with image textures need a browser to export; these color-only models convert in Node.
import { readFileSync, writeFileSync } from "node:fs";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { USDZExporter } from "three/addons/exporters/USDZExporter.js";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: node scripts/glb-to-usdz.mjs <file.glb> [...]");
  process.exit(1);
}

const loader = new GLTFLoader();
const exporter = new USDZExporter();

for (const file of files) {
  const buf = readFileSync(file);
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const gltf = await new Promise((resolve, reject) => loader.parse(arrayBuffer, "", resolve, reject));
  // Quick Look needs normals for correct lighting; some low-poly models ship without them.
  gltf.scene.traverse((o) => {
    if (o.isMesh && !o.geometry.attributes.normal) o.geometry.computeVertexNormals();
  });
  const usdz = await exporter.parseAsync(gltf.scene, {
    quickLookCompatible: true,
    ar: { anchoring: { type: "plane" }, planeAnchoring: { alignment: "horizontal" } },
  });
  const out = file.replace(/\.glb$/i, ".usdz");
  writeFileSync(out, Buffer.from(usdz));
  console.log(`${out}: ${(usdz.byteLength / 1024).toFixed(0)} KB`);
}
