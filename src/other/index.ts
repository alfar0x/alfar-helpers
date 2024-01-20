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

export const onlyUnique = <T>(value: T, index: number, array: T[]) =>
  array.indexOf(value) === index;
