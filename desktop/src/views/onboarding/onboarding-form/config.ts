import { LOCALE_MAP } from "@services/locale/index.config";

export const LOCALE_OPTIONS = Object.entries(LOCALE_MAP).map(
  ([key, value]) => ({
    value: key,
    label: value,
  }),
);
