// Third Party Imports
import Icon from "solid-fa";
import { styled } from "solid-styled-components";
import {
  faCheck,
  faChevronDown,
  faGlobe,
  faPaintbrushPencil,
} from "@fortawesome/pro-light-svg-icons";
import { DropdownMenu, TextField } from "@kobalte/core";

// Local Imports
import { BodyTextVariant, Text, THEME_NAMES, useStyle } from "@services/styles";
import { LOCALE_KEYS, LOCALE_MAP } from "@services/locale/index.config";
import { SupportedLocale, useLocale } from "@services/locale";
import { StyleThemeName } from "@services/styles/index.types";
import { useAuth } from "@services/auth";
import { For } from "solid-js";

export interface TopBarProps {}

export function TopBar(_props: TopBarProps) {
  //
  // Hooks
  //

  const auth = useAuth();
  const locale = useLocale();
  const style = useStyle();

  //
  // Event Handlers
  //

  function onClickLocale(nextLocale: SupportedLocale): void {
    locale.setActiveLocale(nextLocale);
  }

  async function onClickTheme(themeName: StyleThemeName): Promise<void> {
    console.log("store: ", style.store.activeTheme);
    await style.setActiveTheme(themeName);
  }

  function onScopeSearchInput(_event: Event): void {}

  return (
    <Styled.Container isLoggedIn={!auth.store.auth}>
      <Styled.ScopeSearchContainer>
        <TextField.Root>
          <TextField.Input onChange={onScopeSearchInput} />
          <TextField.Description>
            Search repositories with search schema
          </TextField.Description>
        </TextField.Root>
      </Styled.ScopeSearchContainer>

      <Styled.ConfigContainer>
        {/* Start Locale Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Text variant={BodyTextVariant.ButtonText}>
              <Icon icon={faGlobe} />
            </Text>
            <DropdownMenu.Icon>
              <Icon icon={faChevronDown} />
            </DropdownMenu.Icon>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content>
              <For each={LOCALE_KEYS}>
                {(localeKey) => (
                  <DropdownMenu.CheckboxItem
                    checked={localeKey === locale.store.locale}
                    onChange={() => onClickLocale(localeKey)}
                  >
                    <DropdownMenu.ItemIndicator>
                      <Icon icon={faCheck} />
                    </DropdownMenu.ItemIndicator>
                    {LOCALE_MAP[localeKey]}
                  </DropdownMenu.CheckboxItem>
                )}
              </For>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        {/* End Locale Menu */}

        {/* Start Theme Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Text variant={BodyTextVariant.ButtonText}>
              <Icon icon={faPaintbrushPencil} />
            </Text>
            <DropdownMenu.Icon>
              <Icon icon={faChevronDown} />
            </DropdownMenu.Icon>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content>
              <For each={THEME_NAMES}>
                {(themeName) => (
                  <DropdownMenu.CheckboxItem
                    checked={themeName === style.store.activeTheme}
                    onChange={() => onClickTheme(themeName)}
                  >
                    <DropdownMenu.ItemIndicator>
                      <Icon icon={faCheck} />
                    </DropdownMenu.ItemIndicator>
                    {themeName}
                  </DropdownMenu.CheckboxItem>
                )}
              </For>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        {/* End Theme Menu */}
      </Styled.ConfigContainer>
    </Styled.Container>
  );
}

const Styled = {
  Container: styled.div<{ isLoggedIn: boolean }>`
    opacity: ${({ isLoggedIn }) => (!isLoggedIn ? `0.5` : 1)};
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 50px;
    padding: 0.2rem 1rem;
  `,
  ScopeSearchContainer: styled.div``,
  ScopeSearchInput: styled.input``,
  ConfigContainer: styled.div``,
};
