// Convierte los originales de images-src/<grupo>/<nombre>.<ext> en WebP dentro de public/images/<grupo>/.
// Los originales no se versionan (ver .gitignore); solo las WebP resultantes.
//
//   pnpm images
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "images-src";
const DEST = "public/images";
const GROUPS = ["products", "brand"];
const MAX_SIDE = 800; // la ficha muestra la foto a unos 700 px como máximo: no se sirven tamaños mayores
const QUALITY = 80;
const INPUT_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg"]);

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function main() {
  let files = 0;
  let before = 0;
  let after = 0;

  for (const group of GROUPS) {
    const inputDir = path.join(SRC, group);
    const outputDir = path.join(DEST, group);
    await fs.mkdir(outputDir, { recursive: true });
    const entries = await fs.readdir(inputDir).catch(() => []);

    for (const entry of entries.sort()) {
      const { name, ext } = path.parse(entry);
      if (!INPUT_EXTENSIONS.has(ext.toLowerCase())) continue;
      const input = path.join(inputDir, entry);
      const output = path.join(outputDir, `${name}.webp`);
      await sharp(input)
        .rotate() // respeta la orientación EXIF
        .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(output);
      before += (await fs.stat(input)).size;
      after += (await fs.stat(output)).size;
      files += 1;
    }
  }

  console.log(`${files} imágenes: ${kb(before)} -> ${kb(after)} (${Math.round((1 - after / before) * 100)}% menos)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
