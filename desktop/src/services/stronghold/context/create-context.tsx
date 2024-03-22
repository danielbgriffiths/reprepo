// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { StrongholdBindings } from "../index.types";
import { NOT_INITIALIZED_ERROR } from "../index.config";

export const StrongholdContext = createContext<StrongholdBindings>({
  insert: async () => {
    throw new Error(NOT_INITIALIZED_ERROR);
  },
  read: async () => {
    throw new Error(NOT_INITIALIZED_ERROR);
  },
  save: async () => {
    throw new Error(NOT_INITIALIZED_ERROR);
  },
  remove: async () => {
    throw new Error(NOT_INITIALIZED_ERROR);
  },
  isInitialized: () => false,
});
