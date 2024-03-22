// Third Party Imports
import { Accessor, JSXElement } from "solid-js";

export type StyleBindings = [
  Accessor<StyleTheme>,
  {
    setActiveTheme: (themeName: StyleThemeName) => Promise<void>;
  },
];

export interface StyleProviderProps {
  children: JSXElement;
}

export enum StyleThemeName {
  Light = "Light",
  Dark = "Dark",
}

export type StyleTheme = Record<string, any>;
