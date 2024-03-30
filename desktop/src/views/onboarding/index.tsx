// Third Party Imports
import { styled } from "solid-styled-components";
import { createEffect, createSignal, Match, Switch } from "solid-js";

// Local Imports
import { cmd } from "@services/commands/index.utils";
import { Commands } from "@services/commands";
import { LOCALE_KEYS } from "@services/locale/index.config";
import { useNotifications } from "@services/notifications";
import { useAuth } from "@services/auth";
import { useNavigate } from "@solidjs/router";
import LocaleForm from "@views/onboarding/locale-form.tsx";
import AgeForm from "@views/onboarding/age-form.tsx";
import AvatarForm from "@views/onboarding/avatar-form.tsx";
import { UserOnboardingPartial } from "@/models";
import { SupportedLocale } from "@services/locale";

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
  const [values, setValues] = createSignal<UserOnboardingPartial>({
    locale: LOCALE_KEYS[0],
    age: 0,
    avatar: undefined,
    isOnboarded: false,
  });

  //
  // Lifecycle
  //

  createEffect(async () => {
    const updateUserResult = await cmd<UserOnboardingPartial>(
      Commands.UpdateUser,
      {
        ...values(),
        userId: auth.store.user!.id,
      },
    );

    if (updateUserResult.error) {
      return notificationActions.addNotification({
        type: "error",
        message: updateUserResult.error.message,
        duration: -1,
        isRemovableByClick: true,
      });
    }

    auth.updateUser(updateUserResult.data!);

    let message!: string;

    switch (step()) {
      case 1:
        message = `Locale is saved, ${auth.store.user!.firstName}!`;
        break;
      case 2:
        message = `Age is saved, ${auth.store.user!.firstName}!`;
        break;
      case 3:
        message = `Good job onboarding, ${auth.store.user!.firstName}!`;
        break;
    }

    notificationActions.addNotification({
      type: "success",
      message: message,
      duration: step() !== 3 ? 2000 : 5000,
      isRemovableByClick: step() !== 3,
    });

    if (step() === 3) return;

    navigate("/auth/repositories");
  });

  //
  // Event Handlers
  //

  function onSubmit(key: "locale" | "age" | "avatar", value: any): void {
    setValues((prev) => ({ ...prev, isOnboarded: step() === 3, [key]: value }));
    setStep(step() + 1);
  }

  return (
    <Styled.Container>
      <Switch>
        <Match when={step() === 0}>
          <LocaleForm
            defaultValue={auth.store.user?.locale ?? SupportedLocale.EnglishUS}
            onSubmit={(value) => onSubmit("locale", value)}
          />
        </Match>
        <Match when={step() === 1}>
          <AgeForm
            defaultValue={auth.store.user?.age ?? 18}
            onSubmit={(value) => onSubmit("age", value)}
            onBack={() => setStep(0)}
          />
        </Match>
        <Match when={step() === 2}>
          <AvatarForm
            onSubmit={(value) => onSubmit("avatar", value)}
            onBack={() => setStep(1)}
          />
        </Match>
      </Switch>
    </Styled.Container>
  );
}

export const Styled = {
  Container: styled.div``,
};
