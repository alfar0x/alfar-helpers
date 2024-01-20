import fs from 'fs';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { ZodObject, z } from 'zod';

declare const formatRel: (sec: number) => string;

declare const createFiles: (paths: string[]) => void;
declare const readdir: (dir: fs.PathLike) => string[];
declare const readFile: (name: fs.PathOrFileDescriptor) => string;
declare const readByLine: (name: string) => string[];
declare const appendFile: (name: fs.PathOrFileDescriptor, data: string | Uint8Array) => void;
declare const writeFile: (name: fs.PathOrFileDescriptor, data: string | Uint8Array) => void;

declare class Config<T extends ZodObject<any, any, any>> {
    private readonly fileName;
    private readonly configSchema;
    private readonly defaultValues;
    constructor(fileName: string, configSchema: T, defaultValues: z.infer<T>);
    getConfig: () => {
        [x: string]: any;
    };
    private initializeConfig;
    checkIsConfigValid: () => boolean;
    updateConfig: () => void;
}

declare class ProgressState {
    private allCount;
    private threshold;
    private prevTasksTimeMs;
    private leftCount;
    private currStartTimeMs;
    /**
     * @param {number} allCount
     * @param {number=} threshold
     */
    constructor(allCount: number, threshold?: number);
    startTask(): void;
    endTask(): void;
    get doneCount(): number;
    countStateStr(): string;
    predictRemainingTime(): number;
    private getMedian;
    private getAverage;
    approxEndStr(): string;
}

interface Message {
    message: {
        chat: {
            id?: number;
        };
        text?: string;
        date?: number;
    };
}
declare class Telegram {
    private chatIds;
    private url;
    private allowedUpdatesSec?;
    private parseMode?;
    constructor(token: string, chatIds: number[] | number, options?: {
        allowedUpdatesSec?: number;
        parseMode?: "Markdown" | "HTML";
    });
    static formatMarkdownText(text: string): string;
    static formatHtmlText(text: string): string;
    sendMessage(text: string): Promise<void>;
    clearUpdates(lastUpdateId: number): void;
    static getMarkdownLink(text: string, url: string): string;
    __getUpdates(): Promise<Message[]>;
    getUpdates(): Promise<string[]>;
}

declare const nowPrefix: () => string;
declare const sleep: (sec: number) => Promise<unknown>;
declare const onlyUnique: <T>(value: T, index: number, array: T[]) => boolean;

type ProxyItem = {
    type: "http" | "socks";
    host: string;
    port: number | string;
    username: string;
    password: string;
};
declare const getProxyAgent: (proxy?: ProxyItem) => HttpsProxyAgent<`http://${string}:${string}@${string}:${string}` | `http://${string}:${string}@${string}:${number}`> | SocksProxyAgent | undefined;
declare const getProxies: (proxy: string, divider?: string) => {
    type: "http" | "socks";
    host: string;
    port: number;
    username: string;
    password: string;
    changeUrl?: string | undefined;
};

declare const randomChoice: <T>(array: T[]) => T;
declare const randomInt: (min: number, max: number) => number;
declare const roundToDecimal: (n: number, decimalPlaces: number) => number;
declare const randomFloat: (min: number, max: number, decimalPlaces: number) => number;
declare const randomUserAgent: () => string;

declare const replaceAll: (str: string, replacers: {
    search: string;
    replace: string;
}[]) => string;

export { Config, ProgressState, Telegram, appendFile, createFiles, formatRel, getProxies, getProxyAgent, nowPrefix, onlyUnique, randomChoice, randomFloat, randomInt, randomUserAgent, readByLine, readFile, readdir, replaceAll, roundToDecimal, sleep, writeFile };
