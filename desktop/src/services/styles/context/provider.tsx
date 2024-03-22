// Third Party Imports
import { createSignal, onMount } from "solid-js";

// Local Imports
import { StyleContext } from "./create-context";
import {
  StyleBindings,
  StyleProviderProps,
  StyleTheme,
  StyleThemeName,
} from "../index.types";
import { DEFAULT_THEME } from "@services/styles";
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

  const [activeTheme, setActiveTheme] = createSignal<StyleTheme>(DEFAULT_THEME);

  //
  // Lifecycle
  //

  onMount(async () => {
    const themeName = (await stronghold.read(
      StrongholdKeys.ActiveTheme,
    )) as StyleThemeName;

    if (!themeName) return;

    setActiveTheme(THEMES_MAP[themeName]);
  });

  const styleBindings: StyleBindings = [
    activeTheme,
    {
      setActiveTheme: async (themeName: StyleThemeName) => {
        setActiveTheme(THEMES_MAP[themeName]);

        await stronghold.insert(StrongholdKeys.ActiveTheme, themeName);
        await stronghold.save();
      },
    },
  ];

  return (
    <StyleContext.Provider value={styleBindings}>
      {props.children}
    </StyleContext.Provider>
  );
}
