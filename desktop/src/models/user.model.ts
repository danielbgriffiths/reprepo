// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";
import { ApiAuth, Auth } from "@models/auth.model";
import { AuthAccount, ApiAuthAccount } from "@models/auth-account.model";

export interface ApiUser extends ApiBaseDataModel {
  auth_id: number;
  first_name: string;
  last_name: string;
  age: number;
  locale?: string;
  avatar?: string;
  is_onboarded: boolean;
}

export interface User extends BaseDataModel {
  authId: number;
  firstName: string;
  lastName: string;
  age: number;
  locale?: string;
  avatar?: string;
  isOnboarded: boolean;
}

export interface ApiAuthenticatedUser {
  user: ApiUser;
  auth: ApiAuth;
  auth_account: ApiAuthAccount;
}

export interface AuthenticatedUser {
  user: User;
  auth: Auth;
  authAccount: AuthAccount;
}

export interface UserOnboardingPartial {
  locale: string;
  age: number;
  avatar?: string;
  isOnboarded: boolean;
}
