// Third Party Imports
import { JSX, JSXElement } from "solid-js";
import Accessor = JSX.Accessor;

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
