export enum Commands {
  // Auth
  CreateGoogleOAuth = "create_google_oauth",
  Logout = "logout",

  // User
  GetUsers = "get_users",
  GetAuthenticatedUser = "get_authenticated_user",
  UpdateUserOnboarding = "update_user_onboarding",

  // General
  GetEnv = "get_env",

  // File
  UploadFile = "upload_file",
  DeleteFile = "delete_file",
  GetFile = "get_file",
  AsyncProcAvatarResize = "async_proc_avatar_resize",

  // Repository
  GetRepository = "get_repository",
  GetRepositories = "get_repositories",
  CreateRepository = "create_repository",

  // Record
  GetRecords = "get_records",
  CreateRecord = "create_record",
}
