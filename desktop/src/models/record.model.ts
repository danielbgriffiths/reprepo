// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export interface ApiRecord extends ApiBaseDataModel {
  repository_id: number;
}

export interface Record extends BaseDataModel {
  repositoryId: number;
}
