// Third Party Imports
import { DefaultTheme } from "solid-styled-components";

// Local Imports
import { StyleThemeName } from "@services/styles/index.types";
import {
  BodyTextVariant,
  HeadingTextVariant,
  TypographyType,
} from "@services/styles/components/text";

export const DEFAULT_THEME: DefaultTheme = {
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
  border: {
    size: "1px",
  },
  typography: {
    [TypographyType.Heading]: {
      [HeadingTextVariant.SuperTitle]: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: "61px",
        fontWeight: "300",
        lineHeight: "normal",
        letterSpacing: "-0.5px",
      },
      [HeadingTextVariant.Title]: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: "24px",
        fontWeight: "400",
        lineHeight: "normal",
        letterSpacing: "0px",
      },
      [HeadingTextVariant.ExpressiveTitle]: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: "20px",
        fontWeight: "500",
        lineHeight: "normal",
        letterSpacing: "0.15px",
      },
      [HeadingTextVariant.SubTitle]: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "normal",
        letterSpacing: "0.15px",
      },
      [HeadingTextVariant.ExpressiveSubTitle]: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "normal",
        letterSpacing: "0.1px",
      },
    },
    [TypographyType.Body]: {
      [BodyTextVariant.ExpressiveText]: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "normal",
        letterSpacing: "0.5px",
      },
      [BodyTextVariant.Text]: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "normal",
        letterSpacing: "0.25px",
      },
      [BodyTextVariant.ButtonText]: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "normal",
        letterSpacing: "1.25px",
      },
      [BodyTextVariant.CaptionText]: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: "12px",
        fontWeight: "400",
        lineHeight: "normal",
        letterSpacing: "0.4px",
      },
      [BodyTextVariant.OverlineText]: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: "10px",
        fontWeight: "400",
        lineHeight: "normal",
        letterSpacing: "1.5px",
      },
    },
  },
};

export const THEMES_MAP: Record<StyleThemeName, DefaultTheme> = {
  [StyleThemeName.Light]: DEFAULT_THEME,
  [StyleThemeName.Dark]: {
    ...DEFAULT_THEME,
    colors: {
      primary: "black",
    },
  },
};

export const THEME_NAMES = Object.keys(THEMES_MAP) as StyleThemeName[];
