import Config from "./config";
import ProgressState from "./progress-state";
import Telegram from "./telegram";

export { Config, ProgressState, Telegram };

export const nowPrefix = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

export const sleep = (sec: number) =>
  new Promise((resolve) => setTimeout(resolve, Math.round(sec * 1000)));

export const getObjectKeys = <T extends object>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};

export const formatUrlParams = (
  searchParams: Record<string, string | number>
) => {
  const stringSearchParams: Record<string, string> = getObjectKeys(
    searchParams
  ).reduce<Record<string, string>>(
    (acc, key) => ({ ...acc, [key]: String(searchParams[key]) }),
    {}
  );

  return new URLSearchParams(stringSearchParams).toString();
};

export const getMyIp = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const json = (await response.json()) as any;

    return json?.ip || null;
  } catch (error) {
    return null;
  }
};

export const waitInternetConnectionLoop = async (
  sleepSec = 60,
  maxRetries = 1000,
  onWait: () => void
) => {
  let retries = 0;

  while (retries < maxRetries) {
    const myIp = await getMyIp();

    if (myIp) return;

    onWait();

    await sleep(sleepSec);

    retries += 1;
  }

  throw new Error("Max retries to check internet connection failed");
};
