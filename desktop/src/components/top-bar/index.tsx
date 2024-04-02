// Third Party Imports
import Icon from "solid-fa";
import { styled } from "solid-styled-components";
import { faGlobe, faPaintbrushPencil } from "@fortawesome/pro-light-svg-icons";

// Local Imports
import { THEME_NAMES, useStyle } from "@services/styles";
import { LOCALE_KEYS, LOCALE_MAP } from "@services/locale/index.config";
import { SupportedLocale, useLocale } from "@services/locale";
import { StyleThemeName } from "@services/styles/index.types";
import { useAuth } from "@services/auth";

export interface TopBarProps {}

export function TopBar(_props: TopBarProps) {
  //
  // Hooks
  //

  const auth = useAuth();
  const locale = useLocale();
  const [activeTheme, styleActions] = useStyle();

  //
  // Event Handlers
  //

  function onClickLocale(nextLocale: SupportedLocale): void {
    locale.setActiveLocale(nextLocale);
  }

  async function onClickTheme(themeName: StyleThemeName): Promise<void> {
    await styleActions.setActiveTheme(themeName);
  }

  function onScopeSearchInput(_event: Event): void {}

  return (
    <Styled.Container isLoggedIn={!auth.store.auth}>
      <Styled.ScopeSearchContainer>
        <Styled.ScopeSearchInput onInput={onScopeSearchInput} />
      </Styled.ScopeSearchContainer>

      <Styled.ConfigContainer>
        <Styled.ConfigList>
          {/* Locale Menu */}
          <Styled.ConfigListItem>
            <Styled.ConfigDetailMenu>
              <Styled.ConfigDetailMenuSummary>
                <Icon icon={faGlobe} /> {locale.store.locale}
              </Styled.ConfigDetailMenuSummary>
              <Styled.ConfigDetailMenuList>
                {LOCALE_KEYS.map((localeKey) => (
                  <Styled.ConfigDetailMenuListItem
                    isActive={localeKey === locale.store.locale}
                  >
                    <Styled.ConfigDetailMenuTrigger
                      onClick={() => onClickLocale(localeKey)}
                    >
                      {LOCALE_MAP[localeKey]}
                    </Styled.ConfigDetailMenuTrigger>
                  </Styled.ConfigDetailMenuListItem>
                ))}
              </Styled.ConfigDetailMenuList>
            </Styled.ConfigDetailMenu>
          </Styled.ConfigListItem>

          {/* Theme Menu */}
          <Styled.ConfigListItem>
            <Styled.ConfigDetailMenu>
              <Styled.ConfigDetailMenuSummary>
                <Icon icon={faPaintbrushPencil} />
              </Styled.ConfigDetailMenuSummary>
              <Styled.ConfigDetailMenuList>
                {THEME_NAMES.map((themeName) => (
                  <Styled.ConfigDetailMenuListItem
                    isActive={themeName === activeTheme()}
                  >
                    <Styled.ConfigDetailMenuTrigger
                      onClick={() => onClickTheme(themeName)}
                    >
                      {themeName}
                    </Styled.ConfigDetailMenuTrigger>
                  </Styled.ConfigDetailMenuListItem>
                ))}
              </Styled.ConfigDetailMenuList>
            </Styled.ConfigDetailMenu>
          </Styled.ConfigListItem>
        </Styled.ConfigList>
      </Styled.ConfigContainer>
    </Styled.Container>
  );
}

const Styled = {
  Container: styled.div<{ isLoggedIn: boolean }>`
    opacity: ${({ isLoggedIn }) => (!isLoggedIn ? `0.5` : 1)};
  `,
  ScopeSearchContainer: styled.div``,
  ScopeSearchInput: styled.input``,
  ConfigContainer: styled.div``,
  ConfigList: styled.ul``,
  ConfigListItem: styled.li``,
  ConfigDetailMenu: styled.details``,
  ConfigDetailMenuSummary: styled.summary``,
  ConfigDetailMenuList: styled.ul``,
  ConfigDetailMenuListItem: styled.li<{ isActive: boolean }>``,
  ConfigDetailMenuTrigger: styled.a``,
};
