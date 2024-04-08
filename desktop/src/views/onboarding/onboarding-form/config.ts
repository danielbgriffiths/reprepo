import { LOCALE_MAP } from "@services/locale/index.config.ts";

export const LOCALE_OPTIONS = Object.entries(LOCALE_MAP).map(
  ([key, value]) => ({
    value: key,
    label: value,
  }),
);
