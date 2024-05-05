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
  GetCommitCalendar = "get_commit_calendar",
  GetYearsList = "get_years_list",

  // Record
  GetRecords = "get_records",
  CreateRecord = "create_record",
  GetRecord = "get_record",

  // Commit
  GetCommits = "get_commits",
  CreateCommit = "create_commit",
  GetCommit = "get_commit",

  // Author Meta
  GetAuthors = "get_authors",

  // Composition Meta
  GetNames = "get_names",

  // AI
  GenerateAuthorCompositionMeta = "generate_author_composition_meta",
}
