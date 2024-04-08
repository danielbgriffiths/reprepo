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
