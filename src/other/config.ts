import * as ini from "ini";
import { z, ZodObject } from "zod";
import { nowPrefix } from ".";
import { readFile, writeFile } from "../file";

class Config<T extends ZodObject<any, any, any>> {
  private readonly fileName: string;
  private readonly configSchema: T;
  private readonly defaultValues: z.infer<T>;

  constructor(fileName: string, configSchema: T, defaultValues: z.infer<T>) {
    this.fileName = fileName;
    this.configSchema = configSchema;
    this.defaultValues = defaultValues;

    this.initializeConfig();
  }

  getConfig = () => {
    const iniContent = readFile(this.fileName);
    const parsedIni = ini.parse(iniContent);

    return this.configSchema.parse(parsedIni);
  };

  private initializeConfig = () => {
    writeFile(this.fileName, ini.stringify(this.defaultValues));
  };

  checkIsConfigValid = () => {
    const iniContent = readFile(this.fileName);
    const parsedIni = ini.parse(iniContent);

    return this.configSchema.safeParse(parsedIni).success;
  };

  updateConfig = () => {
    if (this.checkIsConfigValid()) return;

    const configBackup = readFile(this.fileName);
    writeFile(`./input/${nowPrefix()}-config-backup.ini`, configBackup);
    this.initializeConfig();
  };
}

export const iniNumberSchema = z
  .string()
  .regex(/\d+/, "Must be a number")
  .transform((str) => Number(str));

export default Config;
