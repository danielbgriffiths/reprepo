// Third Party Imports
import { useContext } from "solid-js";

// Local Imports
import { DataContext } from "./create-context";
import { DataBindings } from "../index.types";

export function useData(): DataBindings {
  return useContext(DataContext);
}
