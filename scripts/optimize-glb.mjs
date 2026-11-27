// Shrinks a textured GLB for mobile AR (target < 2.5 MB) without changing its size or placement:
//   - color texture  → max 2048 px JPEG (what the eye sees on the table)
//   - other textures → max 1024 px (normal / roughness / occlusion maps)
//   - geometry       → Draco compression (supported by model-viewer, Scene Viewer and our USDZ export)
//   - recenters the dish (x/z centered, bottom on y=0) so it appears exactly where the phone points
//   - drops unused data and unknown extensions
//
// Usage: node scripts/optimize-glb.mjs <in.glb> <out.glb> [--no-draco]
//   --no-draco: for the copy handed to Android Scene Viewer (camera view), which may not decode Draco.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { center, dedup, draco, prune, textureCompress, weld } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import sharp from "sharp";
import { statSync } from "node:fs";

const args = process.argv.slice(2);
const noDraco = args.includes("--no-draco");
const [input, output] = args.filter((a) => !a.startsWith("--"));
if (!input || !output) {
  console.error("Usage: node scripts/optimize-glb.mjs <in.glb> <out.glb>");
  process.exit(1);
}

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
    "draco3d.encoder": await draco3d.createEncoderModule(),
  });

const doc = await io.read(input);
await doc.transform(
  dedup(),
  prune(),
  weld(),
  center({ pivot: "below" }),
  textureCompress({ encoder: sharp, targetFormat: "jpeg", quality: 82, resize: [2048, 2048], slots: /^baseColor/ }),
  textureCompress({ encoder: sharp, targetFormat: "jpeg", quality: 80, resize: [1024, 1024], slots: /^(?!baseColor)/ }),
  ...(noDraco ? [] : [draco({ method: "edgebreaker" })]),
);
// Keep only what viewers need; model-viewer/Scene Viewer don't need visibility metadata.
for (const ext of doc.getRoot().listExtensionsUsed()) {
  if (!["KHR_draco_mesh_compression", "KHR_materials_emissive_strength", "KHR_texture_transform"].includes(ext.extensionName)) ext.dispose();
}
await io.write(output, doc);

const mb = (f) => (statSync(f).size / 1048576).toFixed(2);
console.log(`${output}: ${mb(input)} MB → ${mb(output)} MB`);
