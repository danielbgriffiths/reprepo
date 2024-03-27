// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export enum AuthenticationProvider {
  Google = "Google",
  Instagram = "Instagram",
  Pinterest = "Pinterest",
  Email = "Email",
}

export interface ApiAuth extends ApiBaseDataModel {
  password?: string;
  email?: string;
  provider: AuthenticationProvider;
}

export interface Auth extends BaseDataModel {
  password?: string;
  email?: string;
  provider: AuthenticationProvider;
}
