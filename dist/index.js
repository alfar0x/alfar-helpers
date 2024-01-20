"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => config_default,
  ProgressState: () => progress_state_default,
  Telegram: () => telegram_default,
  appendFile: () => appendFile,
  createFiles: () => createFiles,
  formatRel: () => formatRel,
  getProxies: () => getProxies,
  getProxyAgent: () => getProxyAgent,
  nowPrefix: () => nowPrefix,
  onlyUnique: () => onlyUnique,
  randomChoice: () => randomChoice,
  randomFloat: () => randomFloat,
  randomInt: () => randomInt,
  randomUserAgent: () => randomUserAgent,
  readByLine: () => readByLine,
  readFile: () => readFile,
  readdir: () => readdir,
  replaceAll: () => replaceAll,
  roundToDecimal: () => roundToDecimal,
  sleep: () => sleep,
  writeFile: () => writeFile
});
module.exports = __toCommonJS(src_exports);

// src/date-time/index.ts
var import_date_fns = require("date-fns");

// src/strings/index.ts
var replaceAll = (str, replacers) => {
  return replacers.reduce(
    (s, { search, replace }) => s.replaceAll(search, replace),
    str
  );
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
var formatRel = (sec) => {
  const time = (0, import_date_fns.addSeconds)(/* @__PURE__ */ new Date(), sec);
  const relative = (0, import_date_fns.formatRelative)(time, /* @__PURE__ */ new Date());
  const relFormatted = (0, import_date_fns.differenceInMinutes)(time, /* @__PURE__ */ new Date()) > 24 * 60 ? relative : relative.replace("today at ", "").replace("tomorrow at ", "");
  const distance = replaceAll(
    (0, import_date_fns.formatDistanceToNowStrict)(time),
    distanceReplacers
  );
  return `${relFormatted} (${distance})`;
};

// src/files/index.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var encoding = "utf-8";
var createFiles = (paths) => {
  paths.forEach((filePath) => {
    const absolutePath = import_path.default.resolve(filePath);
    if (import_fs.default.existsSync(absolutePath))
      return;
    const isDirectory = import_path.default.extname(filePath) === "";
    if (isDirectory) {
      import_fs.default.mkdirSync(absolutePath, { recursive: true });
      console.log(`Directory created: ${absolutePath}`);
      return;
    }
    const dirname = import_path.default.dirname(absolutePath);
    if (!import_fs.default.existsSync(dirname)) {
      import_fs.default.mkdirSync(dirname, { recursive: true });
      console.log(`Directory created: ${dirname}`);
    }
    import_fs.default.writeFileSync(absolutePath, "", "utf-8");
    console.log(`File created: ${absolutePath}`);
  });
};
var readdir = (dir) => import_fs.default.readdirSync(dir);
var readFile = (name) => import_fs.default.readFileSync(name, { encoding });
var readByLine = (name) => readFile(name).split(/\r?\n/).filter(Boolean);
var appendFile = (name, data) => import_fs.default.appendFileSync(name, data, { encoding });
var writeFile = (name, data) => import_fs.default.writeFileSync(name, data, { encoding });

// src/logger/index.ts
var import_winston = require("winston");

// src/other/config.ts
var ini = __toESM(require("ini"));
var Config = class {
  fileName;
  configSchema;
  defaultValues;
  constructor(fileName, configSchema, defaultValues) {
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
  initializeConfig = () => {
    writeFile(this.fileName, ini.stringify(this.defaultValues));
  };
  checkIsConfigValid = () => {
    const iniContent = readFile(this.fileName);
    const parsedIni = ini.parse(iniContent);
    return this.configSchema.safeParse(parsedIni).success;
  };
  updateConfig = () => {
    if (this.checkIsConfigValid())
      return;
    const configBackup = readFile(this.fileName);
    writeFile(`./input/${nowPrefix()}-config-backup.ini`, configBackup);
    this.initializeConfig();
  };
};
var config_default = Config;

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
  static getMarkdownLink(text, url) {
    return `[${text}](${url})`;
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
var onlyUnique = (value, index, array) => array.indexOf(value) === index;

// src/logger/index.ts
var customFormat = import_winston.format.printf(
  ({ level, message, timestamp }) => `${timestamp} | ${level} | ${message}`
);
var initLogger = () => {
  const time = nowPrefix();
  const formatTimestamp = import_winston.format.timestamp({ format: "HH:mm:ss" });
  const logger2 = (0, import_winston.createLogger)({
    transports: [
      new import_winston.transports.Console({
        level: "info",
        format: import_winston.format.combine(
          import_winston.format.colorize(),
          import_winston.format.splat(),
          formatTimestamp,
          customFormat
        )
      }),
      new import_winston.transports.File({
        level: "debug",
        filename: `./logs/${time}_debug.log`,
        format: import_winston.format.combine(import_winston.format.splat(), formatTimestamp, customFormat)
      }),
      new import_winston.transports.File({
        level: "info",
        filename: `./logs/${time}_info.log`,
        format: import_winston.format.combine(import_winston.format.splat(), formatTimestamp, customFormat)
      }),
      new import_winston.transports.File({
        level: "error",
        filename: `./logs/${time}_error.log`,
        format: import_winston.format.combine(import_winston.format.splat(), formatTimestamp, customFormat)
      })
    ]
  });
  return logger2;
};
var logger = initLogger();

// src/proxy/index.ts
var import_https_proxy_agent = require("https-proxy-agent");
var import_socks_proxy_agent = require("socks-proxy-agent");
var import_zod = require("zod");
var getProxyAgent = (proxy) => {
  if (!proxy)
    return void 0;
  const { type, host, port, username, password } = proxy;
  switch (type) {
    case "http": {
      return new import_https_proxy_agent.HttpsProxyAgent(
        `http://${username}:${password}@${host}:${port}`
      );
    }
    case "socks": {
      return new import_socks_proxy_agent.SocksProxyAgent(
        `socks://${username}:${password}@${host}:${port}`
      );
    }
    default: {
      throw new Error(`proxy type is not allowed ${type}`);
    }
  }
};
var ipOrDomainPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.?)+(?:[A-Za-z]{2,6})$/;
var ipOrDomainSchema = import_zod.z.string().refine((value) => ipOrDomainPattern.test(value), {
  message: "Invalid IP or domain format"
});
var proxySchema = import_zod.z.object({
  type: import_zod.z.union([import_zod.z.literal("http"), import_zod.z.literal("socks")]),
  host: ipOrDomainSchema,
  port: import_zod.z.string().regex(/\d+/, "Must be a number").transform((str) => Number(str)),
  username: import_zod.z.string(),
  password: import_zod.z.string(),
  changeUrl: import_zod.z.string().url().optional()
});
var getProxies = (proxy, divider = ";") => {
  const [type, host, port, user, pass, changeUrl] = proxy.split(divider);
  return proxySchema.parse({ type, host, port, user, pass, changeUrl });
};

// src/random/index.ts
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
var randomUserAgent = () => randomChoice(readByLine("./assets/user-agents.txt"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  ProgressState,
  Telegram,
  appendFile,
  createFiles,
  formatRel,
  getProxies,
  getProxyAgent,
  nowPrefix,
  onlyUnique,
  randomChoice,
  randomFloat,
  randomInt,
  randomUserAgent,
  readByLine,
  readFile,
  readdir,
  replaceAll,
  roundToDecimal,
  sleep,
  writeFile
});
//# sourceMappingURL=index.js.map