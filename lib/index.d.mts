import fs from 'fs';
import * as winston from 'winston';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { z, ZodNever, Primitive, ZodLiteral } from 'zod';

declare const onlyUnique: <T>(value: T, index: number, array: T[]) => boolean;
declare const sortStrings: (a: string, b: string) => number;
declare const splitIntoAvgChunks: <T>(arr: T[], maxChunkSize: number) => T[][];
declare const zip: <T>(...arrays: T[][]) => T[][];

declare const formatRel: (sec: number) => string;

declare const createFiles: (paths: string[]) => void;
declare const writeFile: (name: fs.PathOrFileDescriptor, data: string | Uint8Array) => void;
declare const readdir: (dir: fs.PathLike) => string[];
declare const readFile: (name: fs.PathOrFileDescriptor) => string;
declare const readByLine: (name: string) => string[];
declare const appendFile: (name: fs.PathOrFileDescriptor, data: string | Uint8Array) => void;

declare const initDefaultLogger: (consoleLevel?: "info" | "debug") => winston.Logger;

declare class IniConfig<F extends z.ZodTypeAny, D extends z.ZodTypeAny> {
    private readonly fileName;
    private readonly schema;
    readonly fixed: z.infer<F>;
    private _dynamic;
    private onDynamicError;
    private defaultValues;
    constructor(params: {
        fileName: string;
        fixedSchema: F;
        dynamicSchema: D;
        onDynamicError: (msg: string) => void;
        defaultValues: {
            fixed: z.infer<F>;
            dynamic: z.infer<D>;
        };
    });
    private getFileData;
    dynamic(): z.TypeOf<D>;
    private checkIsFileValid;
    resetFile(): void;
}
declare const iniNumberSchema: z.ZodEffects<z.ZodString, number, string>;

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

declare class Queue<T> {
    protected storage: T[];
    constructor(storage?: T[]);
    push(element: T): void;
    pushMany(...elements: T[]): void;
    shift(): T | null;
    isEmpty(): boolean;
    size(): number;
    toString(): string;
}

declare const nowPrefix: () => string;
declare const sleep: (sec: number) => Promise<unknown>;
declare const getObjectKeys: <T extends object>(obj: T) => (keyof T)[];
declare const formatUrlParams: (searchParams: Record<string, string | number>) => string;
declare const getMyIp: () => Promise<any>;
declare const waitInternetConnectionLoop: (sleepSec: number | undefined, maxRetries: number | undefined, onWait: () => void) => Promise<void>;

declare const proxySchema: z.ZodObject<{
    type: z.ZodUnion<[z.ZodLiteral<"https">, z.ZodLiteral<"socks">]>;
    host: z.ZodEffects<z.ZodString, string, string>;
    port: z.ZodEffects<z.ZodString, number, string>;
    username: z.ZodString;
    password: z.ZodString;
    changeUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "https" | "socks";
    host: string;
    port: number;
    username: string;
    password: string;
    changeUrl?: string | undefined;
}, {
    type: "https" | "socks";
    host: string;
    port: string;
    username: string;
    password: string;
    changeUrl?: string | undefined;
}>;
type ProxyItem = Omit<z.infer<typeof proxySchema>, "changeUrl">;
declare const getProxyAgent: (proxy?: ProxyItem) => HttpsProxyAgent<`http://${string}:${string}@${string}:${number}`> | SocksProxyAgent | undefined;
declare const parseProxy: (proxy: string, divider?: string) => {
    type: "https" | "socks";
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
declare const shuffle: <T>(array: T[]) => T[];
declare const randomChoices: <T>(array: T[], count: number, isDuplicates?: boolean) => T[];

declare const replaceAll: (str: string, replacers: {
    search: string;
    replace: string;
}[]) => string;
declare const formatShortString: (str: string, symbolsCount: number, endSymbols?: number) => string;

type MappedZodLiterals<T extends readonly Primitive[]> = {
    -readonly [K in keyof T]: ZodLiteral<T[K]>;
};
declare function createUnionSchema<T extends readonly []>(values: T): ZodNever;
declare function createUnionSchema<T extends readonly [Primitive]>(values: T): ZodLiteral<T[0]>;
declare function createUnionSchema<T extends readonly [Primitive, Primitive, ...Primitive[]]>(values: T): z.ZodUnion<MappedZodLiterals<T>>;

declare const evmAddressSchema: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;

declare const evmPrivateKeySchema: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;

declare const formatZodError: (issues: z.ZodIssue[]) => string;

declare const ipSchema: z.ZodEffects<z.ZodString, string, string>;

export { IniConfig, ProgressState, type ProxyItem, Queue, Telegram, appendFile, createFiles, createUnionSchema, evmAddressSchema, evmPrivateKeySchema, formatRel, formatShortString, formatUrlParams, formatZodError, getMyIp, getObjectKeys, getProxyAgent, iniNumberSchema, initDefaultLogger, ipSchema, nowPrefix, onlyUnique, parseProxy, randomChoice, randomChoices, randomFloat, randomInt, randomUserAgent, readByLine, readFile, readdir, replaceAll, roundToDecimal, shuffle, sleep, sortStrings, splitIntoAvgChunks, waitInternetConnectionLoop, writeFile, zip };
