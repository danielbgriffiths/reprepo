// Third Party Imports
import { styled } from "solid-styled-components";
import { createEffect, createSignal, Match, Switch, on } from "solid-js";

// Local Imports
import { userCommands } from "@services/commands";
import { LOCALE_KEYS } from "@services/locale/index.config";
import { useNotifications } from "@services/notifications";
import { useAuth } from "@services/auth";
import { useNavigate } from "@solidjs/router";
import LocaleForm from "@views/onboarding/locale-form";
import AgeForm from "@views/onboarding/age-form";
import AvatarForm from "@views/onboarding/avatar-form";
import { UserOnboardingPartial } from "@/models";
import { SupportedLocale } from "@services/locale";
import { NotificationKey } from "@services/notifications/index.types";

export default function Onboarding() {
  //
  // Hooks
  //

  const notifications = useNotifications();
  const auth = useAuth();
  const navigate = useNavigate();

  //
  // State
  //

  const [step, setStep] = createSignal<number>(0);
  const [values, setValues] = createSignal<UserOnboardingPartial>({
    locale: auth.store.user!.locale ?? LOCALE_KEYS[0],
    age: auth.store.user!.age ?? 18,
    avatar: undefined,
    isOnboarded: false,
  });

  //
  // Lifecycle
  //

  createEffect(
    on(step, async (nextStep) => {
      if (nextStep === 0) return;

      const args = {
        userChanges: {
          ...values(),
          is_onboarded: values().isOnboarded,
        },
        userId: auth.store.user!.id,
      };

      const updatedUser = await userCommands.updateUserOnboarding(args);

      if (!updatedUser) {
        return notifications.register(
          NotificationKey.UpdateUserOnboardingError,
        );
      }

      auth.updateUser(updatedUser);

      let message!: string;
      switch (nextStep) {
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

      notifications.register(NotificationKey.UpdateUserOnboardingSuccess, {
        message: message,
        duration: nextStep !== 3 ? 2000 : 5000,
        isRemovableByClick: step() !== 3,
      });

      if (nextStep !== 3) return;

      navigate("/auth/repositories");
    }),
  );

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
            defaultValue={auth.store.user?.avatar}
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
