import { styled } from "solid-styled-components";
import { Title as ImportedTitle } from "@services/styles";

export const Wrapper = styled.div`
  padding: 2rem;

  width: 420px;
`;

export const Title = styled(ImportedTitle)`
  margin-bottom: 1rem;
`;

export const FormActions = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
