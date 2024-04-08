// Third Party Imports
import { styled } from "solid-styled-components";

export type TypographyStyleObject = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
};

export enum TypographyType {
  Body = "body",
  Heading = "heading",
}

export enum BodyTextVariant {
  Text = "text",
  ExpressiveText = "expressiveText",
  ButtonText = "buttonText",
  CaptionText = "captionText",
  OverlineText = "overlineText",
}

export enum HeadingTextVariant {
  SuperTitle = "superTitle",
  Title = "title",
  ExpressiveTitle = "expressiveTitle",
  SubTitle = "subTitle",
  ExpressiveSubTitle = "expressiveSubTitle",
}

export type TextProps = {
  variant?: BodyTextVariant;
};

export type TitleProps = {
  variant?: HeadingTextVariant;
};

export const Text = styled.div<TextProps>`
  ${({ theme, variant }): string | undefined => {
    if (!theme) return;

    const typographyTypeObject = theme.typography[TypographyType.Body];

    const typography = typographyTypeObject[variant || BodyTextVariant.Text];

    return `
          font-family: ${typography.fontFamily};
          font-size: ${typography.fontSize};
          font-weight: ${typography.fontWeight};
          line-height: ${typography.lineHeight};
          letter-spacing: ${typography.letterSpacing};
        `;
  }};
`;

export const Title = styled.div<TitleProps>`
  ${({ theme, variant }): string | undefined => {
    if (!theme) return;

    const typographyTypeObject = theme.typography[TypographyType.Heading];

    const typography =
      typographyTypeObject[variant || HeadingTextVariant.Title];

    return `
          font-family: ${typography.fontFamily};
          font-size: ${typography.fontSize};
          font-weight: ${typography.fontWeight};
          line-height: ${typography.lineHeight};
          letter-spacing: ${typography.letterSpacing};
        `;
  }};
`;
