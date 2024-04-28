export enum Events {
  ResizeAvatar = "resize_avatar",
  ResizeRepositoryAvatar = "resize_repository_avatar",
  GenerateAuthorCompositionMeta = "generate_author_composition_meta",
}

export enum EventState {
  Started = "started",
  InProgress = "in-progress",
  Completed = "completed",
  Failed = "failed",
}

export type ProgressEventResponse =
  | {
      state: EventState.Started;
    }
  | {
      state: EventState.InProgress;
      percentage: number;
    }
  | {
      state: EventState.Completed;
    }
  | {
      state: EventState.Failed;
      error: string;
    };

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
