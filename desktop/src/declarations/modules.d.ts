// Third Party Imports
import "solid-styled-components";

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "solid-styled-components" {
  export interface DefaultTheme {}
}
