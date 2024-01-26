// src/array/index.ts
var onlyUnique = (value, index, array) => array.indexOf(value) === index;
var sortStrings = (a, b) => a.localeCompare(b);
var splitIntoAvgChunks = (arr, maxChunkSize) => {
  const res = [];
  const chunks = Math.ceil(arr.length / maxChunkSize);
  const chunkSize = Math.ceil(arr.length / chunks);
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};
var zip = (...arrays) => {
  if (arrays.some((a) => a.length !== arrays[0].length)) {
    throw new Error(`Length must be equal`);
  }
  return arrays[0].map((_, i) => arrays.map((a) => a[i]));
};

// src/date-time/index.ts
import {
  addSeconds,
  formatRelative,
  differenceInMinutes,
  formatDistanceToNowStrict
} from "date-fns";

// src/string/index.ts
var replaceAll = (str, replacers) => {
  return replacers.reduce(
    (s, { search, replace }) => s.replaceAll(search, replace),
    str
  );
};
var formatShortString = (str, symbolsCount, endSymbols) => {
  if (str.length <= symbolsCount * 2)
    return str;
  const start = str.substring(0, symbolsCount);
  const end = str.substring(str.length - (endSymbols || symbolsCount));
  return `${start}...${end}`;
};

// src/date-time/index.ts
var distanceReplacers = [
  { search: " seconds", replace: "s" },
  { search: " minutes", replace: "m" },
  { search: " hours", replace: "h" },
  { search: " days", replace: "d" },
  { search: " months", replace: "mth" },
  { search: " years", replace: "y" },
  { search: " second", replace: "s" },
  { search: " minute", replace: "m" },
  { search: " hour", replace: "h" },
  { search: " day", replace: "d" },
  { search: " month", replace: "mth" },
  { search: " year", replace: "y" }
];
var relativeReplaces = [
  { search: "today at ", replace: "" },
  { search: "tomorrow at ", replace: "" }
];
var formatRel = (sec) => {
  const time = addSeconds(/* @__PURE__ */ new Date(), sec);
  const relative = formatRelative(time, /* @__PURE__ */ new Date());
  const relFormatted = differenceInMinutes(time, /* @__PURE__ */ new Date()) > 24 * 60 ? relative : replaceAll(relative, relativeReplaces);
  const distance = replaceAll(
    formatDistanceToNowStrict(time),
    distanceReplacers
  );
  return `${relFormatted} (${distance})`;
};

// src/file/index.ts
import fs from "fs";
import path from "path";
var encoding = "utf-8";
var createFiles = (paths) => {
  paths.forEach((filePath) => {
    const absolutePath = path.resolve(filePath);
    if (fs.existsSync(absolutePath))
      return;
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
var writeFile = (name, data) => {
  if (typeof name === "string") {
    createFiles([name]);
  }
  fs.writeFileSync(name, data, { encoding });
};
var readdir = (dir) => fs.readdirSync(dir);
var readFile = (name) => fs.readFileSync(name, { encoding });
var readByLine = (name) => readFile(name).split(/\r?\n/).filter(Boolean);
var appendFile = (name, data) => fs.appendFileSync(name, data, { encoding });

// src/logger/init-default-logger.ts
import { format, createLogger, transports } from "winston";

// src/other/ini-config.ts
import * as ini from "ini";

// src/zod/create-union-schema.ts
import { z } from "zod";
function createManyUnion(literals) {
  return z.union(
    literals.map((value) => z.literal(value))
  );
}
function createUnionSchema(values) {
  if (values.length > 1) {
    return createManyUnion(
      values
    );
  } else if (values.length === 1) {
    return z.literal(values[0]);
  } else if (values.length === 0) {
    return z.never();
  }
  throw new Error("array must have a length");
}

// src/zod/evm-address-schema.ts
import { z as z2 } from "zod";
var evmAddressSchema = z2.string().refine((value) => /^(0x)?[0-9a-fA-F]{40}$/.test(value), {
  message: "Invalid Ethereum address format"
}).transform((value) => value.startsWith("0x") ? value : `0x${value}`);
var evm_address_schema_default = evmAddressSchema;

// src/zod/evm-private-key-schema.ts
import { z as z3 } from "zod";
var evmPrivateKeySchema = z3.string().refine((value) => /^(0x)?[0-9a-fA-F]{64}$/.test(value), {
  message: "Invalid Ethereum private key format"
}).transform((value) => value.startsWith("0x") ? value : `0x${value}`);
var evm_private_key_schema_default = evmPrivateKeySchema;

// src/zod/format-zod-error.ts
var transform = (issue) => `[${issue.path.join(".")}] ${issue.message}`;
var formatZodError = (issues) => issues.map(transform).join("\n");
var format_zod_error_default = formatZodError;

// src/zod/ip-schema.ts
import { z as z4 } from "zod";
var ipOrDomainPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.?)+(?:[A-Za-z]{2,6})$/;
var ipSchema = z4.string().refine((value) => ipOrDomainPattern.test(value), {
  message: "Invalid IP or domain format"
});
var ip_schema_default = ipSchema;

// src/other/ini-config.ts
import { z as z5 } from "zod";
var IniConfig = class {
  fileName;
  schema;
  _fixed;
  _dynamic;
  onDynamicError;
  defaultValues;
  constructor(params) {
    const {
      fileName,
      fixedSchema,
      dynamicSchema,
      onDynamicError,
      defaultValues
    } = params;
    this.fileName = fileName;
    this.onDynamicError = onDynamicError;
    this.defaultValues = defaultValues;
    this.schema = z5.object({
      dynamic: Object.keys(defaultValues.dynamic).length ? dynamicSchema : dynamicSchema.optional(),
      fixed: Object.keys(defaultValues.fixed).length ? fixedSchema : fixedSchema.optional()
    });
    this._fixed = null;
    this._dynamic = null;
  }
  getFileData() {
    const iniContent = readFile(this.fileName);
    const parsedIni = ini.parse(iniContent);
    const result = this.schema.safeParse(parsedIni);
    if (result.success)
      return result.data;
    throw new Error(format_zod_error_default(result.error.issues));
  }
  initialize() {
    try {
      const { fixed, dynamic } = this.getFileData();
      this._dynamic = dynamic;
      this._fixed = fixed;
    } catch (error) {
      this.resetFile();
      throw error;
    }
  }
  get fixed() {
    if (!this._fixed)
      this.initialize();
    return this._fixed;
  }
  dynamic() {
    if (!this._dynamic)
      this.initialize();
    try {
      this._dynamic = this.getFileData().dynamic;
    } catch (error) {
      const msg = error?.message || "undefined error";
      this.onDynamicError(
        `used the previous dynamic value due to error. Details: ${msg}`
      );
    }
    return this._dynamic;
  }
  checkIsFileValid() {
    try {
      const iniContent = readFile(this.fileName);
      const parsedIni = ini.parse(iniContent);
      return this.schema.safeParse(parsedIni).success;
    } catch (error) {
      return false;
    }
  }
  resetFile() {
    try {
      const splittedName = this.fileName.split("/");
      const fileName = splittedName[splittedName.length - 1];
      const backupFileName = splittedName.slice(0, -1).join("/") + `/${nowPrefix()}_${fileName}`;
      const configBackup = readFile(this.fileName);
      if (configBackup.trim().length) {
        writeFile(backupFileName, configBackup);
      }
    } catch (error) {
    }
    writeFile(this.fileName, ini.stringify(this.defaultValues));
    return true;
  }
};
var iniNumberSchema = z5.string().regex(/\d+/, "Must be a number").transform((str) => Number(str));
var ini_config_default = IniConfig;

// src/other/progress-state.ts
var ProgressState = class {
  allCount;
  threshold;
  prevTasksTimeMs;
  leftCount;
  currStartTimeMs;
  /**
   * @param {number} allCount
   * @param {number=} threshold
   */
  constructor(allCount, threshold = 1.5) {
    this.allCount = allCount;
    this.threshold = threshold;
    this.prevTasksTimeMs = [];
    this.leftCount = allCount - this.prevTasksTimeMs.length;
    this.currStartTimeMs = null;
  }
  startTask() {
    this.currStartTimeMs = Date.now();
  }
  endTask() {
    this.prevTasksTimeMs.push(Date.now() - this.currStartTimeMs);
    this.currStartTimeMs = null;
    this.leftCount -= 1;
  }
  get doneCount() {
    return this.allCount - this.leftCount;
  }
  countStateStr() {
    return `${this.doneCount}/${this.allCount}`;
  }
  predictRemainingTime() {
    const median = this.getMedian(this.prevTasksTimeMs);
    const absoluteDifferences = this.prevTasksTimeMs.map(
      (time) => Math.abs(time - median)
    );
    const medianAbsoluteDifference = this.getMedian(absoluteDifferences);
    const filteredTasks = this.prevTasksTimeMs.filter(
      (time, index) => absoluteDifferences[index] <= this.threshold * medianAbsoluteDifference
    );
    const filteredAverageTimePerTask = this.getAverage(filteredTasks);
    const remainingTime = filteredAverageTimePerTask * this.leftCount;
    return Math.round(remainingTime / 1e3);
  }
  getMedian(array) {
    const sortedArray = [...array].sort((a, b) => a - b);
    const middle = Math.floor(sortedArray.length / 2);
    if (sortedArray.length % 2 === 0) {
      return (sortedArray[middle - 1] + sortedArray[middle]) / 2;
    } else {
      return sortedArray[middle];
    }
  }
  getAverage(array) {
    return array.reduce((sum, time) => sum + time, 0) / array.length;
  }
  approxEndStr() {
    if (!this.prevTasksTimeMs.length)
      return "end undefined";
    return `${formatRel(this.predictRemainingTime())}`;
  }
};
var progress_state_default = ProgressState;

// src/other/telegram.ts
var Telegram = class {
  chatIds;
  url;
  allowedUpdatesSec;
  parseMode;
  constructor(token, chatIds, options = {}) {
    if (!token || !chatIds) {
      throw new Error("telegram token and ids are required");
    }
    this.chatIds = typeof chatIds === "number" ? [chatIds] : chatIds;
    this.url = `https://api.telegram.org/bot${token}`;
    const { allowedUpdatesSec, parseMode } = options;
    this.allowedUpdatesSec = allowedUpdatesSec;
    this.parseMode = parseMode;
  }
  static formatMarkdownText(text) {
    const escapeSymbols = ["_", "*", "`", "["];
    let formattedText = text;
    for (const escapeSymbol of escapeSymbols) {
      formattedText = formattedText.replaceAll(
        escapeSymbol,
        `\\${escapeSymbol}`
      );
    }
    return formattedText;
  }
  static formatHtmlText(text) {
    const replacers = [
      { searchValue: "<", replaceValue: "&lt;" },
      { searchValue: ">", replaceValue: "&gt;" },
      { searchValue: "&", replaceValue: "&amp;" }
    ];
    let formattedText = text;
    for (const { searchValue, replaceValue } of replacers) {
      formattedText = formattedText.replaceAll(searchValue, replaceValue);
    }
    return formattedText;
  }
  async sendMessage(text) {
    for (const id of this.chatIds) {
      const query = this.parseMode ? new URLSearchParams({
        chat_id: String(id),
        text,
        parse_mode: this.parseMode
      }).toString() : new URLSearchParams({ chat_id: String(id), text }).toString();
      await fetch(`${this.url}/sendMessage?${query}`).catch(
        (e) => console.error(e)
      );
    }
  }
  clearUpdates(lastUpdateId) {
    fetch(`${this.url}/getUpdates?offset=${lastUpdateId}`);
  }
  static getMarkdownLink(text, url2) {
    return `[${text}](${url2})`;
  }
  async __getUpdates() {
    const allowed_updates = ["message"].join(",");
    const query = new URLSearchParams({ allowed_updates }).toString();
    const res = await fetch(`${this.url}/getUpdates?${query}`);
    const data = await res.json();
    if (!data?.result?.length)
      return [];
    const lastUpdateId = data.result[data.result.length - 1].update_id + 1;
    this.clearUpdates(lastUpdateId);
    return data.result;
  }
  async getUpdates() {
    const updates = await this.__getUpdates();
    const filtered = updates.filter((msg) => {
      if (!this.chatIds.includes(msg?.message?.chat?.id))
        return false;
      if (!msg?.message?.text)
        return false;
      if (this.allowedUpdatesSec) {
        const msgTime = msg?.message?.date;
        if (!msgTime)
          return false;
        const allowedMessageTime = Math.round(Date.now() / 1e3) - this.allowedUpdatesSec;
        if (msgTime < allowedMessageTime)
          return false;
      }
      return true;
    }).map((msg) => msg?.message?.text).filter(onlyUnique).filter(Boolean);
    return filtered;
  }
};
var telegram_default = Telegram;

// src/other/queue.ts
var Queue = class {
  storage;
  constructor(storage) {
    this.storage = storage ?? [];
  }
  push(element) {
    this.storage.push(element);
  }
  pushMany(...elements) {
    this.storage.push(...elements);
  }
  shift() {
    if (this.isEmpty())
      return null;
    return this.storage.shift();
  }
  isEmpty() {
    return this.storage.length === 0;
  }
  size() {
    return this.storage.length;
  }
  toString() {
    return this.storage.map(String).join(", ");
  }
};
var queue_default = Queue;

// src/other/get-gesko-prices.ts
var url = "https://api.coingecko.com/api/v3/simple/price";
var getGeskoPrices = async (tokens) => {
  const params = {
    ids: tokens,
    vs_currencies: "usd"
  };
  const urlParams = new URLSearchParams(params).toString();
  const response = await fetch(url + "?" + urlParams);
  const data = await response.json();
  const prices = tokens.reduce(
    (acc, token) => {
      return { ...acc, [token]: data[token]?.usd || 0 };
    },
    {}
  );
  return prices;
};
var get_gesko_prices_default = getGeskoPrices;

// src/other/index.ts
var nowPrefix = () => {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};
var sleep = (sec) => new Promise((resolve) => setTimeout(resolve, Math.round(sec * 1e3)));
var getObjectKeys = (obj) => {
  return Object.keys(obj);
};
var formatUrlParams = (searchParams) => {
  const stringSearchParams = getObjectKeys(
    searchParams
  ).reduce(
    (acc, key) => ({ ...acc, [key]: String(searchParams[key]) }),
    {}
  );
  return new URLSearchParams(stringSearchParams).toString();
};
var getMyIp = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const json = await response.json();
    return json?.ip || null;
  } catch (error) {
    return null;
  }
};
var waitInternetConnectionLoop = async (sleepSec = 60, maxRetries = 1e3, onWait) => {
  let retries = 0;
  while (retries < maxRetries) {
    const myIp = await getMyIp();
    if (myIp)
      return;
    onWait();
    await sleep(sleepSec);
    retries += 1;
  }
  throw new Error("Max retries to check internet connection failed");
};

// src/logger/init-default-logger.ts
var customFormat = format.printf(
  ({ level, message, timestamp }) => `${timestamp} | ${level} | ${message}`
);
var initDefaultLogger = (consoleLevel = "info") => {
  const time = nowPrefix();
  const formatTimestamp = format.timestamp({ format: "HH:mm:ss" });
  const logger = createLogger({
    transports: [
      new transports.Console({
        level: consoleLevel,
        format: format.combine(
          format.colorize(),
          format.splat(),
          formatTimestamp,
          customFormat
        )
      }),
      new transports.File({
        level: "debug",
        filename: `./logs/${time}_debug.log`,
        format: format.combine(format.splat(), formatTimestamp, customFormat)
      }),
      new transports.File({
        level: "info",
        filename: `./logs/${time}_info.log`,
        format: format.combine(format.splat(), formatTimestamp, customFormat)
      }),
      new transports.File({
        level: "error",
        filename: `./logs/${time}_error.log`,
        format: format.combine(format.splat(), formatTimestamp, customFormat)
      })
    ]
  });
  return logger;
};
var init_default_logger_default = initDefaultLogger;

// src/proxy/index.ts
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";
import { z as z6 } from "zod";
var proxySchema = z6.object({
  type: z6.union([z6.literal("https"), z6.literal("socks")]),
  host: ip_schema_default,
  port: z6.string().regex(/\d+/, "Must be a number").transform((str) => Number(str)),
  username: z6.string(),
  password: z6.string(),
  changeUrl: z6.string().url().optional()
});
var getProxyAgent = (proxy) => {
  if (!proxy)
    return void 0;
  const { type, host, port, username, password } = proxy;
  switch (type) {
    case "https": {
      return new HttpsProxyAgent(
        `http://${username}:${password}@${host}:${port}`
      );
    }
    case "socks": {
      return new SocksProxyAgent(
        `socks://${username}:${password}@${host}:${port}`
      );
    }
    default: {
      throw new Error(`proxy type is not allowed ${type}`);
    }
  }
};
var parseProxy = (proxy, divider = ";") => {
  const [type, host, port, username, password, changeUrl] = proxy.split(divider);
  const parsed = proxySchema.safeParse({
    type,
    host,
    port,
    username,
    password,
    changeUrl
  });
  if (!parsed.success)
    throw new Error(format_zod_error_default(parsed.error.issues));
  return parsed.data;
};

// src/random/index.ts
import path2 from "path";
var randomChoice = (array) => array[Math.floor(Math.random() * array.length)];
var randomInt = (min, max) => {
  const roundedMin = Math.ceil(min);
  const roundedMax = Math.floor(max);
  return Math.floor(Math.random() * (roundedMax - roundedMin + 1)) + roundedMin;
};
var roundToDecimal = (n, decimalPlaces) => {
  const number = Number(n);
  if (decimalPlaces < 0)
    return NaN;
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(number * multiplier) / multiplier;
};
var randomFloat = (min, max, decimalPlaces) => {
  const rnd = Math.random() * (max - min) + min;
  if (decimalPlaces === void 0)
    return rnd;
  return roundToDecimal(rnd, decimalPlaces);
};
var randomUserAgent = () => {
  const filePath = path2.join(__dirname, "../", "assets/user-agents.txt");
  return randomChoice(readByLine(filePath));
};
var shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
var randomChoices = (array, count, isDuplicates = true) => {
  if (isDuplicates) {
    return Array.from({ length: count }).map(() => randomChoice(array));
  }
  return shuffle(array).slice(0, count);
};
export {
  ini_config_default as IniConfig,
  progress_state_default as ProgressState,
  queue_default as Queue,
  telegram_default as Telegram,
  appendFile,
  createFiles,
  createUnionSchema,
  evm_address_schema_default as evmAddressSchema,
  evm_private_key_schema_default as evmPrivateKeySchema,
  formatRel,
  formatShortString,
  formatUrlParams,
  format_zod_error_default as formatZodError,
  get_gesko_prices_default as getGeskoPrices,
  getMyIp,
  getObjectKeys,
  getProxyAgent,
  iniNumberSchema,
  init_default_logger_default as initDefaultLogger,
  ip_schema_default as ipSchema,
  nowPrefix,
  onlyUnique,
  parseProxy,
  randomChoice,
  randomChoices,
  randomFloat,
  randomInt,
  randomUserAgent,
  readByLine,
  readFile,
  readdir,
  replaceAll,
  roundToDecimal,
  shuffle,
  sleep,
  sortStrings,
  splitIntoAvgChunks,
  waitInternetConnectionLoop,
  writeFile,
  zip
};
//# sourceMappingURL=index.mjs.map