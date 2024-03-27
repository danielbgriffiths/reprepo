// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";
import { Auth } from "@models/auth.model";
import { AuthAccount } from "@models/auth-account.model";

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

export interface AuthenticatedUser {
  user: User;
  auth: Auth;
  authAccount: AuthAccount;
}
