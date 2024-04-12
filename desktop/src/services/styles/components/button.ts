// Third Party Imports
import { styled } from "solid-styled-components";
import { Button as KobalteButton } from "@kobalte/core";

export enum ButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
  Ghost = "ghost",
}

interface ButtonProps {
  variant?: ButtonVariant;
}

export const Button = styled(KobalteButton.Root)<ButtonProps>`
  cursor: pointer;
  transition: 0.2s;

  padding: 1rem;
  border: solid 1px grey;
  background-color: transparent;
  color: inherit;

  &:hover {
    border: solid 1px grey;
    background-color: transparent;
    color: inherit;
  }

  &:active,
  &:focus {
    border: solid 1px grey;
    background-color: transparent;
    color: inherit;
  }
`;
