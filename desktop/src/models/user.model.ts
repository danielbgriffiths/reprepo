// Local Imports
import { AuthenticationProvider } from "@services/auth/index.types";

export interface UserSummary {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  provider: AuthenticationProvider;
  locale: string;
}
