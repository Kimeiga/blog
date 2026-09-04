import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceRoot = path.resolve("research/base64-assets");
const outputRoot = path.resolve("public/images");

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, relative = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const nextRelative = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path.join(dir, entry.name), nextRelative)));
    } else {
      files.push(nextRelative);
    }
  }

  return files;
}

if (await exists(sourceRoot)) {
  const groups = new Map();
  const partPattern = /^(.*)\.part-(\d+)\.b64$/;

  for (const relativePath of await walk(sourceRoot)) {
    const match = relativePath.match(partPattern);
    if (!match) continue;

    const [, outputPath, partIndex] = match;
    const parts = groups.get(outputPath) ?? [];
    parts.push({ index: Number(partIndex), relativePath });
    groups.set(outputPath, parts);
  }

  for (const [outputPath, parts] of groups) {
    parts.sort((a, b) => a.index - b.index);

    for (let index = 0; index < parts.length; index += 1) {
      if (parts[index].index !== index) {
        throw new Error(`Missing base64 asset part ${index} for ${outputPath}`);
      }
    }

    const encodedParts = await Promise.all(
      parts.map(({ relativePath }) =>
        readFile(path.join(sourceRoot, relativePath), "utf8"),
      ),
    );
    const data = Buffer.from(encodedParts.join(""), "base64");

    if (outputPath.endsWith(".webp")) {
      const isWebP =
        data.length >= 12 &&
        data.subarray(0, 4).toString() === "RIFF" &&
        data.subarray(8, 12).toString() === "WEBP";
      const declaredLength = data.length >= 8 ? data.readUInt32LE(4) + 8 : -1;

      if (!isWebP || declaredLength !== data.length) {
        throw new Error(`Invalid WebP after materializing ${outputPath}`);
      }
    }

    const destination = path.join(outputRoot, outputPath);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, data);
    console.log(
      `materialized ${path.relative(process.cwd(), destination)} (${data.length} bytes)`,
    );
  }
}
