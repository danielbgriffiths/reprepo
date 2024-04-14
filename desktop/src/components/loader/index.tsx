// Third Party Imports
import { styled, keyframes } from "solid-styled-components";

export enum LoaderVariant {
  Screen = "screen",
  LargeSection = "large-section",
  MediumSection = "medium-section",
  SmallSection = "small-section",
  MediumButton = "medium-button",
}

interface LoaderProps {
  variant: LoaderVariant;
}

export function Loader(props: LoaderProps) {
  return (
    <Wrapper variant={props.variant}>
      <Indicator variant={props.variant} />
    </Wrapper>
  );
}

const Wrapper = styled.div<{ variant: LoaderVariant }>`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ variant }) => {
    switch (variant) {
      case LoaderVariant.Screen:
        return `
          width: 100%;
          height: 100%;
          position: fixed;
        `;
      case LoaderVariant.LargeSection:
      case LoaderVariant.MediumSection:
      case LoaderVariant.SmallSection:
        return `
          width: 100%;
          height: 100%;
        `;
      case LoaderVariant.MediumButton:
        return `
          margin-right: 1rem;
        `;
    }
  }}
`;

const elementKeyframe = keyframes`
  0%,
  12.49% {
    background-size:
      calc(100% / 3) calc(100% / 3),
      0 0,
      0 0,
      0 0,
      0 0,
      0 0,
      0 0,
      0 0;
  }
  12.5%,
  24.9% {
    background-size:
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      0 0,
      0 0,
      0 0,
      0 0,
      0 0,
      0 0;
  }
  25%,
  37.4% {
    background-size:
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      0 0,
      0 0,
      0 0,
      0 0,
      0 0;
  }
  37.5%,
  49.9% {
    background-size:
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      0 0,
      calc(100% / 3) calc(100% / 3),
      0 0,
      0 0,
      0 0;
  }
  50%,
  61.4% {
    background-size:
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      0 0,
      calc(100% / 3) calc(100% / 3),
      0 0,
      0 0,
      calc(100% / 3) calc(100% / 3);
  }
  62.5%,
  74.9% {
    background-size:
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      0 0,
      calc(100% / 3) calc(100% / 3),
      0 0,
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3);
  }
  75%,
  86.4% {
    background-size:
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      0 0,
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3);
  }
  87.5%,
  100% {
    background-size:
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3),
      calc(100% / 3) calc(100% / 3);
  }
`;

const beforeKeyframe = keyframes`
  0%,
  5% {
    transform: translate(0, 0);
  }
  12.5% {
    transform: translate(100%, 0);
  }
  25% {
    transform: translate(200%, 0);
  }
  37.5% {
    transform: translate(200%, 100%);
  }
  50% {
    transform: translate(200%, 200%);
  }
  62.5% {
    transform: translate(100%, 200%);
  }
  75% {
    transform: translate(0, 200%);
  }
  87.5% {
    transform: translate(0, 100%);
  }
  95%,
  100% {
    transform: translate(100%, 100%);
  }
`;

const Indicator = styled.div<{ variant: LoaderVariant }>`
  ${({ theme, variant }) => {
    let backgroundSize!: string;

    switch (variant) {
      case LoaderVariant.Screen:
      case LoaderVariant.LargeSection:
        backgroundSize = "90px";
        break;
      case LoaderVariant.SmallSection:
      case LoaderVariant.MediumButton:
        backgroundSize = "30px";
        break;
      default:
        backgroundSize = "60px";
        break;
    }

    return `
        width: ${backgroundSize};
        aspect-ratio: 1;
        display: flex;
        background:
          linear-gradient(${theme?.colors.primary.main}, 0, 0) 0 0,
          linear-gradient(${theme?.colors.secondary.main}, 0, 0) 50% 0,
          linear-gradient(${theme?.colors.primary.main}, 0, 0) 100% 0,
          linear-gradient(${theme?.colors.secondary.main}, 0, 0) 0 50%,
          linear-gradient(${theme?.colors.secondary.main}, 0, 0) 100% 50%,
          linear-gradient(${theme?.colors.primary.main}, 0, 0) 0 100%,
          linear-gradient(${theme?.colors.secondary.main}, 0, 0) 50% 100%,
          linear-gradient(${theme?.colors.primary.main}, 0, 0) 100% 100%;
        background-repeat: no-repeat;
        animation: ${elementKeyframe} 1.5s infinite alternate;
      
        &:before {
          content: "";
          width: calc(100% / 3);
          height: calc(100% / 3);
          background: ${theme?.colors.neutral.main};
          animation: inherit;
          animation-delay: 0s;
          animation-name: ${beforeKeyframe};
        }
    `;
  }};
`;
