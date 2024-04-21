import { createSignal } from "solid-js";

export interface CropperAPIData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  scale_x: number;
  scale_y: number;
}

export type CropperReturn = {
  set: (data: Cropper.Data | undefined) => void;
  get: () => CropperAPIData | undefined;
};

export function createCropper() {
  //
  // State
  //

  const [crop, set] = createSignal<Cropper.Data | undefined>(undefined);

  //
  // Functions
  //

  function get(): CropperAPIData | undefined {
    if (!crop()) return;

    return {
      x: Math.round(crop()!.x),
      y: Math.round(crop()!.y),
      width: Math.round(crop()!.width),
      height: Math.round(crop()!.height),
      rotate: Math.round(crop()!.rotate),
      scale_x: Math.round(crop()!.scaleX),
      scale_y: Math.round(crop()!.scaleY),
    };
  }

  return {
    set,
    get,
  };
}
