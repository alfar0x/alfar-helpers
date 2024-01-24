import {
  addSeconds,
  formatRelative,
  differenceInMinutes,
  formatDistanceToNowStrict,
} from "date-fns";
import { replaceAll } from "../string";

const distanceReplacers = [
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
  { search: " year", replace: "y" },
];

const relativeReplaces = [
  { search: "today at ", replace: "" },
  { search: "tomorrow at ", replace: "" },
];

export const formatRel = (sec: number) => {
  const time = addSeconds(new Date(), sec);

  const relative = formatRelative(time, new Date());

  const relFormatted =
    differenceInMinutes(time, new Date()) > 24 * 60
      ? relative
      : replaceAll(relative, relativeReplaces);

  const distance = replaceAll(
    formatDistanceToNowStrict(time),
    distanceReplacers
  );

  return `${relFormatted} (${distance})`;
};
