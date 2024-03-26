export enum Commands {
  CreateGoogleOAuth = "create_google_oauth",
  GetUserSummaries = "get_user_summaries",
  GetEnv = "get_env",
  GetAuthenticatedUserSummary = "get_authenticated_user_summary",
  Logout = "logout",
  GetArtistProfiles = "get_artist_profiles",
  UpdateUser = "update user",
  CreateArtistProfile = "create_artist_profile",
}

export interface InvokeResult<T> {
  error?: {
    message: string;
    type?: string;
  };
  data?: T;
}
