// Third Party Imports
import { styled } from "solid-styled-components";
import { DropdownMenu } from "@kobalte/core";

export const DropdownMenuArrow = styled(DropdownMenu.Arrow)<{
  left?: string;
}>`
  ${({ left }) => {
    if (!left) return;
    return `
        left: ${left} !important;
      `;
  }}
`;

export const DropdownMenuContent = styled(DropdownMenu.Content)`
  background-color: ${({ theme }) => theme?.colors.base.c};
  min-width: 140px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.4rem 1rem 0.2rem;
  box-shadow: 7px 6px 20px -7px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 7px 6px 20px -7px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 7px 6px 20px -7px rgba(0, 0, 0, 0.75);

  outline: none;

  border-radius: ${({ theme }) => theme?.radius.card};
`;

export const DropdownMenuItem = styled(DropdownMenu.Item)`
  padding: 0.2rem 0.2rem;
  margin-bottom: 0.2rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: ${({ theme }) => theme?.colors.neutral.main};
  background-color: transparent;
  transition: ${({ theme }) => theme?.animation.duration}
    ${({ theme }) => theme?.animation.easing};

  &[data-highlighted] {
    outline: none;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: ${({ theme }) => theme?.colors.neutral.focus};

    * {
      color: ${({ theme }) => theme?.colors.neutral.focus};
    }
  }
`;

export const DropdownMenuItemAppend = styled.span`
  margin-left: 1rem;
  color: inherit;

  ${({ theme }) => {
    return `
      font-family: ${theme?.typography.body.code.fontFamily};
      font-size: ${theme?.typography.body.code.fontSize};
      font-weight: ${theme?.typography.body.code.fontWeight};
      line-height: ${theme?.typography.body.code.lineHeight};
      letter-spacing: ${theme?.typography.body.code.letterSpacing};
    `;
  }};
`;

export const DropdownMenuItemPrepend = styled.span`
  margin-right: 0.4rem;
  color: inherit;
`;
