// Local Imports
import { AuthenticationProvider } from "@services/auth/index.types";

export interface UserSummary {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  provider: AuthenticationProvider;
  locale: string;
}

export interface User extends UserSummary {
  age: number;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
