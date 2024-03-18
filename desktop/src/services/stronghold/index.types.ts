// Third Party Imports
import { Accessor, JSXElement } from "solid-js";

export interface StrongholdBindings {
  insert: (key: string, value: string) => Promise<void>;
  read: (key: string) => Promise<string | undefined>;
  save: () => Promise<void>;
  remove: (key: string) => Promise<void>;
  isInitialized: Accessor<boolean>;
}

export interface StrongholdProviderProps {
  children: JSXElement;
}
