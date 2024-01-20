import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";

type ProxyItem = {
  type: "http" | "socks";
  host: string;
  port: number | string;
  username: string;
  password: string;
};

export const getProxyAgent = (proxy?: ProxyItem) => {
  if (!proxy) return undefined;

  const { type, host, port, username, password } = proxy;

  switch (type) {
    case "http": {
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

import { z } from "zod";

const ipOrDomainPattern =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.?)+(?:[A-Za-z]{2,6})$/;

const ipOrDomainSchema = z
  .string()
  .refine((value) => ipOrDomainPattern.test(value), {
    message: "Invalid IP or domain format",
  });

const proxySchema = z.object({
  type: z.union([z.literal("http"), z.literal("socks")]),
  host: ipOrDomainSchema,
  port: z
    .string()
    .regex(/\d+/, "Must be a number")
    .transform((str) => Number(str)),
  username: z.string(),
  password: z.string(),
  changeUrl: z.string().url().optional(),
});

export const getProxies = (proxy: string, divider = ";") => {
  const [type, host, port, user, pass, changeUrl] = proxy.split(divider);
  return proxySchema.parse({ type, host, port, user, pass, changeUrl });
};
