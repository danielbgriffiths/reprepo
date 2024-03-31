export enum Commands {
  CreateGoogleOAuth = "create_google_oauth",
  GetUsers = "get_users",
  GetEnv = "get_env",
  GetAuthenticatedUser = "get_authenticated_user",
  Logout = "logout",
  GetRepositories = "get_repositories",
  UpdateUser = "update_user",
  CreateRepository = "create_repository",
  UploadFile = "upload_file",
  DeleteFile = "delete_file",
}

export interface InvokeResult<T> {
  error?: {
    message: string;
    type?: string;
  };
  data?: T;
}
