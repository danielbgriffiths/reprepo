// Third Party Imports
import { Show } from "solid-js";
import { styled } from "solid-styled-components";

// Local Imports
import { Repository, Record } from "@/models";

interface HeaderProps {
  repository?: Repository;
  records?: Record[];
}

export function Header(props: HeaderProps) {
  return (
    <Styled.Header>
      <Show when={props.repository} fallback={<div />}>
        <Styled.Title>{props.repository!.name}</Styled.Title>
        <Styled.Subtitle>
          {props.repository!.field} | {props.repository!.specialization}
        </Styled.Subtitle>
        <Styled.Subtitle>{props.records!.length} Records</Styled.Subtitle>
      </Show>
    </Styled.Header>
  );
}

const Styled = {
  Header: styled.header``,
  Title: styled.h1``,
  Subtitle: styled.span``,
};
