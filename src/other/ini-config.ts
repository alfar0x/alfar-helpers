import * as ini from "ini";

import { formatZodError } from "../zod";
import { ZodOptional, z } from "zod";
import { nowPrefix } from ".";
import { readFile, writeFile } from "../file";

class IniConfig<F extends z.ZodTypeAny, D extends z.ZodTypeAny> {
  private readonly fileName: string;

  private readonly schema: z.ZodObject<{
    fixed: F | ZodOptional<F>;
    dynamic: D | ZodOptional<D>;
  }>;

  private _fixed: z.infer<F> | null;
  private _dynamic: z.infer<D> | null;

  private onDynamicError: (msg: string) => void;
  private defaultValues: { fixed: z.infer<F>; dynamic: z.infer<D> };

  public constructor(params: {
    fileName: string;
    fixedSchema: F;
    dynamicSchema: D;
    onDynamicError: (msg: string) => void;
    defaultValues: { fixed: z.infer<F>; dynamic: z.infer<D> };
    disableInitialize?: boolean;
  }) {
    const {
      fileName,
      fixedSchema,
      dynamicSchema,
      onDynamicError,
      defaultValues,
      disableInitialize = false,
    } = params;

    this.fileName = fileName;
    this.onDynamicError = onDynamicError;
    this.defaultValues = defaultValues;

    this.schema = z.object({
      dynamic: Object.keys(defaultValues.dynamic).length
        ? dynamicSchema
        : dynamicSchema.optional(),
      fixed: Object.keys(defaultValues.fixed).length
        ? fixedSchema
        : fixedSchema.optional(),
    });

    this._fixed = null;
    this._dynamic = null;

    if (!disableInitialize) this.initialize();
  }

  private getFileData() {
    const iniContent = readFile(this.fileName);
    const parsedIni = ini.parse(iniContent);
    const result = this.schema.safeParse(parsedIni);

    if (result.success) return result.data;

    throw new Error(formatZodError(result.error.issues));
  }

  public initialize() {
    try {
      const { fixed, dynamic } = this.getFileData();

      this._dynamic = dynamic;
      this._fixed = fixed;
    } catch (error) {
      this.resetFile();
      throw error;
    }
  }

  public get fixed() {
    if (!this._fixed) throw new Error("Config is not initialized!");
    return this._fixed;
  }

  public dynamic() {
    if (!this._dynamic) throw new Error("Config is not initialized!");

    try {
      this._dynamic = this.getFileData().dynamic;
    } catch (error) {
      const msg = (error as Error)?.message || "undefined error";

      this.onDynamicError(
        `used the previous dynamic value due to error. Details: ${msg}`
      );
    }

    return this._dynamic;
  }

  public checkIsFileValid() {
    try {
      const iniContent = readFile(this.fileName);
      const parsedIni = ini.parse(iniContent);

      return this.schema.safeParse(parsedIni).success;
    } catch (error) {
      return false;
    }
  }

  public resetFile() {
    try {
      const splittedName = this.fileName.split("/");
      const fileName = splittedName[splittedName.length - 1];

      const backupFileName =
        splittedName.slice(0, -1).join("/") + `/${nowPrefix()}_${fileName}`;

      const configBackup = readFile(this.fileName);
      writeFile(backupFileName, configBackup);
    } catch (error) {}

    writeFile(this.fileName, ini.stringify(this.defaultValues));

    return true;
  }
}

export const iniNumberSchema = z
  .string()
  .regex(/\d+/, "Must be a number")
  .transform((str) => Number(str));

export default IniConfig;
