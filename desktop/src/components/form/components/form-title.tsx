// Third Party Imports
import { styled } from "solid-styled-components";

// Local Imports
import { HeadingTextVariant, Title } from "@services/styles";

interface FormTitleProps {
  children: string;
}

export function FormTitle(props: FormTitleProps) {
  return (
    <Element variant={HeadingTextVariant.SubTitle}>{props.children}</Element>
  );
}

const Element = styled(Title)`
  margin-bottom: 1rem;
`;
