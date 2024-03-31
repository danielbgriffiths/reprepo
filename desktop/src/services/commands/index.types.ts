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

  // Repository
  GetRepositories = "get_repositories",
  CreateRepository = "create_repository",
}
