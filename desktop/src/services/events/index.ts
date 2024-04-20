export enum Events {
  ResizeAvatar = "resize_avatar",
}

export enum EventState {
  Started = "started",
  InProgress = "in-progress",
  Completed = "completed",
  Failed = "failed",
}

export type ResizeAvatarResponse =
  | {
      state: EventState.Started;
    }
  | {
      state: EventState.InProgress;
      percentage: number;
    }
  | {
      state: EventState.Completed;
      newAvatar: string;
    }
  | {
      state: EventState.Failed;
      error: string;
    };
