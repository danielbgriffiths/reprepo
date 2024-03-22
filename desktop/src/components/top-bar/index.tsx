import Icon from "solid-fa";
import { faGlobe } from "@fortawesome/pro-light-svg-icons";

export interface TopBarProps {}

export function TopBar(_props: TopBarProps) {
  return (
    <div class="top-bar-container">
      <div class="">
        <input class="scope-search-input" />
      </div>
      <div class="">
        <ul class="">
          <li>
            <a>Link</a>
          </li>
          <li>
            <details>
              <summary>
                <Icon icon={faGlobe} />
              </summary>
              <ul class="">
                <li>
                  <a>Link 1</a>
                </li>
                <li>
                  <a>Link 2</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
}
