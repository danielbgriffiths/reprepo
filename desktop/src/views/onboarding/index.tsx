// Third Party Imports
import { createSignal } from "solid-js";

// Local Imports
import { LOCALE_KEYS } from "@services/locale/index.config";
import { ToastKey, useToast } from "@services/toast";
import { useAuth } from "@services/auth";
import { useNavigate } from "@solidjs/router";
import { userCommands } from "@services/commands";
import { IOnboardingSchema } from "@views/onboarding/onboarding-form/schema";
import { OnboardingForm } from "./onboarding-form";
import { PageContainer, PageContainerVariant } from "@services/styles";

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
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  //
  // Event Handlers
  //

  async function onSubmit(values: IOnboardingSchema): Promise<void> {
    setIsLoading(true);

    const updatedUser = await userCommands.updateUserOnboarding({
      userChanges: {
        ...values,
        cropper_data: getCropperData(),
      },
      userId: auth.store.user!.id,
    });

    if (!updatedUser) {
      setIsLoading(false);
      return toast.register(ToastKey.UpdateUserOnboardingError);
    }

    auth.updateUser(updatedUser);

    toast.register(ToastKey.UpdateUserOnboardingSuccess, {
      message: `Good job onboarding, ${auth.store.user!.firstName}!`,
      duration: 2000,
    });

    setIsLoading(true);

    navigate("/auth/repositories");
  }

  //
  // Functions
  //

  function getCropperData(): Cropper.Data | undefined {
    if (!crop()) return;

    return {
      x: Math.round(crop()!.x),
      y: Math.round(crop()!.y),
      width: Math.round(crop()!.width),
      height: Math.round(crop()!.height),
      rotate: Math.round(crop()!.rotate),
      scale_x: Math.round(crop()!.scaleX),
      scale_y: Math.round(crop()!.scaleY),
    } as unknown as Cropper.Data;
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
        isLoading={isLoading()}
      />
    </PageContainer>
  );
}
