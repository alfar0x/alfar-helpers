import fs from "fs";
import path from "path";

const encoding = "utf-8";

export const createFiles = (paths: string[]) => {
  paths.forEach((filePath) => {
    const absolutePath = path.resolve(filePath);

    if (fs.existsSync(absolutePath)) return;

    const isDirectory = path.extname(filePath) === "";

    if (isDirectory) {
      fs.mkdirSync(absolutePath, { recursive: true });
      console.log(`Directory created: ${absolutePath}`);
      return;
    }

    const dirname = path.dirname(absolutePath);

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
      console.log(`Directory created: ${dirname}`);
    }

    fs.writeFileSync(absolutePath, "", "utf-8");
    console.log(`File created: ${absolutePath}`);
  });
};

export const writeFile = (
  name: fs.PathOrFileDescriptor,
  data: string | Uint8Array
) => {
  if (typeof name === "string") {
    createFiles([name]);
  }

  fs.writeFileSync(name, data, { encoding });
};

export const readdir = (dir: fs.PathLike) => fs.readdirSync(dir);

export const readFile = (name: fs.PathOrFileDescriptor) =>
  fs.readFileSync(name, { encoding });

export const readByLine = (name: string) =>
  readFile(name).split(/\r?\n/).filter(Boolean);

export const appendFile = (
  name: fs.PathOrFileDescriptor,
  data: string | Uint8Array
) => fs.appendFileSync(name, data, { encoding });
