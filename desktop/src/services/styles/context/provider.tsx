// Third Party Imports
import { createEffect, createSignal } from "solid-js";
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
import { useAuth } from "@services/auth";

export function StyleProvider(props: StyleProviderProps) {
  //
  // Hooks
  //

  const stronghold = useStronghold();
  const auth = useAuth();

  //
  // State
  //

  const [activeTheme, setActiveTheme] = createSignal<StyleThemeName>(
    StyleThemeName.Light,
  );

  //
  // Lifecycle
  //

  createEffect(() => {
    if (!auth.store.auth) {
      setActiveTheme(StyleThemeName.Light);
      return;
    }

    const themeName = stronghold.readWithParse(
      StrongholdKeys.ActiveTheme,
      auth.store.user!.id,
    ) as unknown as StyleThemeName;

    if (!themeName) return;

    setActiveTheme(themeName);
  });

  const styleBindings: StyleBindings = [
    activeTheme,
    {
      setActiveTheme: async (themeName: StyleThemeName) => {
        setActiveTheme(themeName);

        if (!auth.store.auth) return;

        await stronghold.insertWithParse(
          StrongholdKeys.ActiveTheme,
          { key: auth.store.user!.id, value: themeName },
          {
            save: true,
          },
        );
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
