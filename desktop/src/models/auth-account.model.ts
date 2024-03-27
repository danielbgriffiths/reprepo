// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export interface ApiAuthAccount extends ApiBaseDataModel {
  auth_id: number;
  account_id: number;
  refresh_token: string;
  access_token: string;
  is_root: boolean;
}

export interface AuthAccount extends BaseDataModel {
  authId: number;
  accountId: number;
  refreshToken: string;
  accessToken: string;
  isRoot: boolean;
}
