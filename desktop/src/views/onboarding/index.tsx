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
import { Events } from "@services/events";
import { createCropper } from "@hooks/create-cropper";

export default function Onboarding() {
  //
  // Hooks
  //

  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const cropper = createCropper();

  //
  // State
  //

  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  //
  // Event Handlers
  //

  async function onSubmit(values: IOnboardingSchema): Promise<void> {
    setIsLoading(true);

    const updatedUser = await userCommands.updateUserOnboarding({
      userChanges: values,
      userId: auth.store.user!.id,
    });

    if (!updatedUser) {
      toast.register(ToastKey.UpdateUserOnboardingError);
      setIsLoading(false);
      return;
    }

    auth.updateUser(updatedUser);
    toast.register(ToastKey.UpdateUserOnboardingSuccess, {
      message: `Good job onboarding, ${auth.store.user!.firstName}!`,
      duration: 2000,
    });
    setIsLoading(true);

    userCommands.asyncProcAvatarResize({
      filePath: values.avatar,
      userId: auth.store.user!.id,
      eventKey: Events.ResizeAvatar,
      cropData: cropper.get(),
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
        setCropper={cropper.set}
        isLoading={isLoading()}
      />
    </PageContainer>
  );
}
