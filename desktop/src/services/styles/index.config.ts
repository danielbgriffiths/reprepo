// Third Party Imports
import { StyleThemeName, StyleTheme } from "@services/styles/index.types.ts";

export const DEFAULT_THEME: StyleTheme = {
  colors: {
    primary: {
      main: "#5a7c65",
      focus: "#48604f",
      content: "#ffffff",
    },
    secondary: {
      main: "#ecf4e7",
      focus: "#cde2c1",
      content: "#24321a",
    },
    accent: {
      main: "#f9e1e1",
      focus: "#f4bebe",
      content: "#322020",
    },
    neutral: {
      main: "#5c5757",
      focus: "#272525",
      content: "#e9e7e7",
    },
    base: {
      a: "#e9e7e7",
      b: "#d1cccc",
      c: "#b9b1b1",
      d: "#b9b1b1",
    },
    state: {
      info: "#1c92f2",
      success: "#009485",
      warning: "#ff9900",
      error: "#ff5724",
    },
  },
  radius: {
    card: "1rem",
    button: "0.5rem",
    badge: "1.9rem",
  },
  animation: {
    duration: "0.2s",
  },
  text: {
    button: "uppercase",
  },
  border: {
    size: "1px",
  },
};

export const THEMES_MAP: Record<StyleThemeName, StyleTheme> = {
  [StyleThemeName.Light]: DEFAULT_THEME,
  [StyleThemeName.Dark]: {
    ...DEFAULT_THEME,
    colors: {
      primary: "black",
    },
  },
};

export const THEME_NAMES = Object.keys(THEMES_MAP) as StyleThemeName[];
