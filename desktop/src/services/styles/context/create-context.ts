// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { StyleBindings, StyleThemeName } from "../index.types";

export const StyleContext = createContext<StyleBindings>({
  store: {
    activeTheme: StyleThemeName.Light,
  },
  setActiveTheme: async (_themeName: StyleThemeName) => {},
});
