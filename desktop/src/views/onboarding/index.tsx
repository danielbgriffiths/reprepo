// Third Party Imports
import { styled } from "solid-styled-components";
import {
  createEffect,
  createMemo,
  createSignal,
  Match,
  Switch,
} from "solid-js";

// Local Imports
import { cmd } from "@services/commands/index.utils";
import { Commands } from "@services/commands";
import { SupportedLocale } from "@services/locale";
import { LOCALE_KEYS, LOCALE_MAP } from "@services/locale/index.config";
import { useNotifications } from "@services/notifications";
import { useAuth } from "@services/auth";
import { useNavigate } from "@solidjs/router";

export default function Onboarding() {
  //
  // Hooks
  //

  const [_, notificationActions] = useNotifications();
  const auth = useAuth();
  const navigate = useNavigate();

  //
  // State
  //

  const [step, setStep] = createSignal<number>(0);
  const [age, setAge] = createSignal<number>(0);
  const [locale, setLocale] = createSignal<SupportedLocale>(
    SupportedLocale.EnglishUS,
  );
  const [avatar, setAvatar] = createSignal<string | undefined>(undefined);

  const isAgeValid = createMemo<boolean>(() => age() > 0);
  const isLocaleValid = createMemo<boolean>(() =>
    LOCALE_KEYS.includes(locale()),
  );
  const isAvatarValid = createMemo<boolean>(() => true);

  //
  // Lifecycle
  //

  createEffect(async () => {
    if (step() !== 3) return;

    const updateUserResult = await cmd<boolean>(Commands.UpdateUser, {
      age: age(),
      locale: locale(),
      avatar: avatar(),
    });

    if (updateUserResult.error) {
      return notificationActions.addNotification({
        type: "error",
        message: updateUserResult.error.message,
        duration: -1,
        isRemovableByClick: true,
      });
    }

    notificationActions.addNotification({
      type: "success",
      message: `Good job onboarding, ${auth.store.user!.firstName}!`,
      duration: 5000,
      isRemovableByClick: false,
    });

    navigate("/auth/repositories");
  });

  //
  // Event Handlers
  //

  function onClickNext() {
    setStep((prev) => prev + 1);
  }

  function onClickPrevious() {
    setStep((prev) => prev - 1);
  }

  function onInputAge(event: Event) {
    const target = event.target as HTMLInputElement;
    setAge(parseInt(target.value));
  }

  function onSelectLocale(event: Event) {
    const target = event.target as HTMLSelectElement;
    setLocale(target.value as SupportedLocale);
  }

  function onChangeAvatar(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  return (
    <Styled.Container>
      <Switch>
        <Match when={step() === 0}>
          <form>
            <label>
              Locale
              <select onSelect={onSelectLocale} value={locale()}>
                {Object.entries(LOCALE_MAP).map((entry) => (
                  <option value={entry[0]}>{entry[1]}</option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={isLocaleValid()}
              onClick={onClickNext}
            >
              Next
            </button>
          </form>
        </Match>
        <Match when={step() === 1}>
          <form>
            <label>
              Age
              <input
                name="age"
                type="number"
                required={true}
                value={age()}
                onInput={onInputAge}
              />
            </label>
            <div>
              <button type="button" onClick={onClickPrevious}>
                Previous
              </button>
              <button
                type="submit"
                disabled={!isAgeValid()}
                onClick={onClickNext}
              >
                Next
              </button>
            </div>
          </form>
        </Match>
        <Match when={step() === 2}>
          <form>
            <label>
              Avatar
              <input name="avatar" type="file" onChange={onChangeAvatar} />
            </label>
            <div>
              <button type="button" onClick={onClickPrevious}>
                Previous
              </button>
              <button
                type="submit"
                disabled={isAvatarValid()}
                onClick={onClickNext}
              >
                Create Repos
              </button>
            </div>
          </form>
        </Match>
      </Switch>
    </Styled.Container>
  );
}

export const Styled = {
  Container: styled.div``,
};
