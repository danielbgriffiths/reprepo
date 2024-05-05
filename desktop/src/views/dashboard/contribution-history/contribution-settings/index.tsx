// Third Party Imports
import { DropdownMenu } from "@kobalte/core";
import Icon from "solid-fa";
import { faCheck, faChevronDown } from "@fortawesome/pro-light-svg-icons";

// Local Imports
import { BodyTextVariant, Text } from "@services/styles";

interface Props {
  isShowPrivateEnabled: boolean;
  onClick: () => void;
}

export function ContributionSettings(props: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Text variant={BodyTextVariant.ButtonText}>Contribution Settings</Text>
        <DropdownMenu.Icon>
          <Icon icon={faChevronDown} />
        </DropdownMenu.Icon>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem
            checked={props.isShowPrivateEnabled}
            onChange={props.onClick}
          >
            <DropdownMenu.ItemIndicator>
              <Icon icon={faCheck} />
            </DropdownMenu.ItemIndicator>
            Show Private
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
