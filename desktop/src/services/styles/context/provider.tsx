// Third Party Imports
import { createEffect } from "solid-js";
import { ThemeProvider } from "solid-styled-components";
import { createStore } from "solid-js/store";

// Local Imports
import { StyleContext } from "./create-context";
import {
  StyleBindings,
  StyleProviderProps,
  StyleThemeName,
  StyleStore,
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

  const [store, setStore] = createStore<StyleStore>({
    activeTheme: StyleThemeName.Light,
  });

  //
  // Lifecycle
  //

  createEffect(() => {
    if (!auth.store.auth) {
      setStore("activeTheme", StyleThemeName.Light);
      return;
    }

    const themeName = stronghold.readWithParse(
      StrongholdKeys.ActiveTheme,
      auth.store.user!.id,
    ) as unknown as StyleThemeName;

    if (!themeName) return;

    setStore("activeTheme", themeName);
  });

  const styleBindings: StyleBindings = {
    store,
    setActiveTheme: async (themeName: StyleThemeName) => {
      setStore("activeTheme", themeName);

      if (!auth.store.auth) return;

      await stronghold.insertWithParse(
        StrongholdKeys.ActiveTheme,
        { key: auth.store.user!.id, value: themeName },
        {
          save: true,
        },
      );
    },
  };

  return (
    <ThemeProvider theme={THEMES_MAP[store.activeTheme]}>
      <StyleContext.Provider value={styleBindings}>
        {props.children}
      </StyleContext.Provider>
    </ThemeProvider>
  );
}
