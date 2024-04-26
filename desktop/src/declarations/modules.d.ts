// Third Party Imports
import "solid-styled-components";
import {
  BodyTextVariant,
  HeadingTextVariant,
  TypographyStyleObject,
  TypographyType,
  ColorVariant,
  ColorObject,
} from "@services/styles";

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "solid-styled-components" {
  export interface DefaultTheme extends StyledTheme {
    [key: string]: unknown;
    typography: {
      heading: {
        [K in HeadingTextVariant]: TypographyStyleObject;
      };
      body: {
        [K in BodyTextVariant]: TypographyStyleObject;
      };
    };
    colors: {
      [K in ColorVariant]: ColorObject;
    };
    border: {
      size: string | number;
    };
    radius: {
      card: string | number;
      button: string | number;
      badge: string | number;
    };
    animation: {
      duration: string | number;
      easing: string | number;
    };
  }
}
