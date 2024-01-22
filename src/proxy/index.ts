import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";
import { z } from "zod";
import { ipSchema } from "../zod";

const proxySchema = z.object({
  type: z.union([z.literal("https"), z.literal("socks")]),
  host: ipSchema,
  port: z
    .string()
    .regex(/\d+/, "Must be a number")
    .transform((str) => Number(str)),
  username: z.string(),
  password: z.string(),
  changeUrl: z.string().url().optional(),
});

export type ProxyItem = Omit<z.infer<typeof proxySchema>, "changeUrl">;

export const getProxyAgent = (proxy?: ProxyItem) => {
  if (!proxy) return undefined;

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

export const parseProxy = (proxy: string, divider = ";") => {
  const [type, host, port, username, password, changeUrl] =
    proxy.split(divider);
  return proxySchema.parse({ type, host, port, username, password, changeUrl });
};
