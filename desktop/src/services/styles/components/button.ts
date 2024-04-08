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

export const Button = styled(KobalteButton.Root)<ButtonProps>``;
