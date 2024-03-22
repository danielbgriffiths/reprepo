import Icon from "solid-fa";
import { styled } from "solid-styled-components";
import { faGlobe, faPaintbrushPencil } from "@fortawesome/pro-light-svg-icons";
import { THEME_NAMES, useStyle } from "@services/styles";
import { LOCALE_KEYS, LOCALE_MAP } from "@services/locale/index.config.ts";
import { SupportedLocale, useLocale } from "@services/locale";
import { StyleThemeName } from "@services/styles/index.types.ts";

export interface TopBarProps {}

export function TopBar(_props: TopBarProps) {
  //
  // State
  //

  const [activeLocale, localActions] = useLocale();
  const [_, styleActions] = useStyle();

  //
  // Event Handlers
  //

  function onClickLocale(locale: SupportedLocale): void {
    localActions.setActiveLocale(locale);
  }

  async function onClickTheme(themeName: StyleThemeName): void {
    await styleActions.setActiveTheme(themeName);
  }

  return (
    <Styled.Container>
      {/* Config List Item 1 */}
      <Styled.ScopeSearchContainer>
        <Styled.ScopeSearchInput />
      </Styled.ScopeSearchContainer>

      {/* Config List Item 1 */}
      <Styled.ConfigContainer>
        <Styled.ConfigList>
          {/* Config List Item 1 */}
          <Styled.ConfigListItem>
            <Styled.ConfigDetailMenu>
              <Styled.ConfigDetailMenuSummary>
                <Icon icon={faPaintbrushPencil} />
              </Styled.ConfigDetailMenuSummary>
              <Styled.ConfigDetailMenuList>
                {THEME_NAMES.map((themeName) => (
                  <Styled.ConfigDetailMenuListItem>
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

          {/* Config List Item 1 */}
          <Styled.ConfigListItem>
            <Styled.ConfigDetailMenu>
              <Styled.ConfigDetailMenuSummary>
                <Icon icon={faGlobe} /> {activeLocale()}
              </Styled.ConfigDetailMenuSummary>
              <Styled.ConfigDetailMenuList>
                {LOCALE_KEYS.map((locale) => (
                  <Styled.ConfigDetailMenuListItem>
                    <Styled.ConfigDetailMenuTrigger
                      onClick={() => onClickLocale(locale)}
                    >
                      {LOCALE_MAP[locale]}
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
  Container: styled.div``,
  ScopeSearchContainer: styled.div``,
  ScopeSearchInput: styled.input``,
  ConfigContainer: styled.div``,
  ConfigList: styled.ul``,
  ConfigListItem: styled.li``,
  ConfigDetailMenu: styled.details``,
  ConfigDetailMenuSummary: styled.summary``,
  ConfigDetailMenuList: styled.ul``,
  ConfigDetailMenuListItem: styled.li``,
  ConfigDetailMenuTrigger: styled.a``,
};
