// Local Imports
import { LOCALE_KEYS } from "@services/locale/index.config";
import { ToastKey, useToast } from "@services/toast";
import { useAuth } from "@services/auth";
import { useNavigate } from "@solidjs/router";
import { userCommands } from "@services/commands";
import { IOnboardingSchema } from "@views/onboarding/onboarding-form/schema";
import { OnboardingForm } from "./onboarding-form";
import { PageContainer, PageContainerVariant } from "@services/styles";
import { createSignal } from "solid-js";

export default function Onboarding() {
  //
  // Hooks
  //

  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  //
  // State
  //

  const [crop, setCrop] = createSignal<Cropper.Data | undefined>(undefined);

  //
  // Event Handlers
  //

  async function onSubmit(values: IOnboardingSchema): Promise<void> {
    const cropFormatted = !crop()
      ? undefined
      : {
          x: crop()!.x,
          y: crop()!.y,
          width: crop()!.width,
          height: crop()!.height,
          rotate: crop()!.rotate,
          scale_x: crop()!.scaleX,
          scale_y: crop()!.scaleY,
        };

    const args = {
      userChanges: {
        ...values,
        crop: cropFormatted,
        is_onboarded: true,
      },
      userId: auth.store.user!.id,
    };

    const updatedUser = await userCommands.updateUserOnboarding(args);

    if (!updatedUser) {
      return toast.register(ToastKey.UpdateUserOnboardingError);
    }

    auth.updateUser(updatedUser);

    toast.register(ToastKey.UpdateUserOnboardingSuccess, {
      message: `Good job onboarding, ${auth.store.user!.firstName}!`,
      duration: 2000,
    });

    navigate("/auth/repositories");
  }

  return (
    <PageContainer variant={PageContainerVariant.Centered}>
      <OnboardingForm
        onSubmit={onSubmit}
        defaultValues={{
          locale: auth.store.user!.locale ?? LOCALE_KEYS[0],
          age: auth.store.user!.age ?? 18,
          avatar: undefined,
        }}
        setCrop={setCrop}
      />
    </PageContainer>
  );
}
