import { defineConfig } from "tsup";

import fs from "fs";
import path from "path";

function copyFilesAndFolders(source: string, destination: string): void {
  source = path.resolve(source);
  destination = path.resolve(destination);

  if (!fs.existsSync(source)) {
    console.error(`Source path ${source} does not exist.`);
    return;
  }

  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  const items = fs.readdirSync(source);

  items.forEach((item) => {
    const sourcePath = path.join(source, item);
    const destinationPath = path.join(destination, item);

    const isDirectory = fs.statSync(sourcePath).isDirectory();

    if (isDirectory) {
      copyFilesAndFolders(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });

  console.log(`Files and folders copied from ${source} to ${destination}.`);
}

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "lib",
  onSuccess: async () => copyFilesAndFolders("./assets", "./lib/assets"),
});
