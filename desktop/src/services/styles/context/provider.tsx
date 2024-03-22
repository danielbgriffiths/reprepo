// Third Party Imports
import { createSignal, onMount } from "solid-js";
import { ThemeProvider } from "solid-styled-components";

// Local Imports
import { StyleContext } from "./create-context";
import {
  StyleBindings,
  StyleProviderProps,
  StyleThemeName,
} from "../index.types";
import { useStronghold } from "@services/stronghold";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { THEMES_MAP } from "../index.config";

export function StyleProvider(props: StyleProviderProps) {
  //
  // Hooks
  //

  const stronghold = useStronghold();

  //
  // State
  //

  const [activeTheme, setActiveTheme] = createSignal<StyleThemeName>(
    StyleThemeName.Light,
  );

  //
  // Lifecycle
  //

  onMount(async () => {
    const themeName = (await stronghold.read(
      StrongholdKeys.ActiveTheme,
    )) as StyleThemeName;

    if (!themeName) return;

    setActiveTheme(themeName);
  });

  const styleBindings: StyleBindings = [
    activeTheme,
    {
      setActiveTheme: async (themeName: StyleThemeName) => {
        setActiveTheme(themeName);

        await stronghold.insert(StrongholdKeys.ActiveTheme, themeName);
        await stronghold.save();
      },
    },
  ];

  return (
    <ThemeProvider theme={THEMES_MAP[activeTheme()]}>
      <StyleContext.Provider value={styleBindings}>
        {props.children}
      </StyleContext.Provider>
    </ThemeProvider>
  );
}
