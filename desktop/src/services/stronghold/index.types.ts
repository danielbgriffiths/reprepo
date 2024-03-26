// Third Party Imports
import { Accessor, JSXElement } from "solid-js";
import { StrongholdKeys } from "@services/stronghold/index.config.ts";

export interface StrongholdBindings {
  insert: (
    key: StrongholdKeys,
    value: string,
    options?: StrongholdCmdOptions,
  ) => Promise<void>;
  insertWithParse: (
    key: StrongholdKeys,
    args: StrongholdParseArgs,
    options?: StrongholdCmdOptions,
  ) => Promise<void>;
  read: (key: StrongholdKeys) => Promise<string | undefined>;
  readWithParse: (
    key: StrongholdKeys,
    uid: string | number,
  ) => Promise<string | undefined>;
  save: () => Promise<void>;
  remove: (
    key: StrongholdKeys,
    options?: StrongholdCmdOptions,
  ) => Promise<void>;
  isInitialized: Accessor<boolean>;
}

export interface StrongholdProviderProps {
  children: JSXElement;
}

export interface StrongholdParseArgs {
  key: string | number;
  value: string | number;
}

export interface StrongholdCmdOptions {
  save?: boolean;
  log?: boolean;
}
