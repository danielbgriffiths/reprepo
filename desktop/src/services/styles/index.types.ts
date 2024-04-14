// Third Party Imports
import { JSXElement } from "solid-js";

export type StyleBindings = {
  store: {
    activeTheme: StyleThemeName;
  };
  setActiveTheme: (_themeName: StyleThemeName) => Promise<void>;
};

export interface StyleProviderProps {
  children: JSXElement;
}

export enum StyleThemeName {
  Light = "Light",
  Dark = "Dark",
}

export interface StyleStore {
  activeTheme: StyleThemeName;
}

export enum ColorVariant {
  Primary = "primary",
  Secondary = "secondary",
  Accent = "accent",
  Neutral = "neutral",
  Base = "base",
  State = "state",
}

export interface ColorObject {
  // Used in Primary, Secondary, Accent, Neutral
  main?: string;
  focus?: string;
  content?: string;

  // Used in State
  info?: string;
  success?: string;
  warning?: string;
  error?: string;

  // Used in Base
  a?: string;
  b?: string;
  c?: string;
  d?: string;
}
