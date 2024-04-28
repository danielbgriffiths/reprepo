// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export interface ApiRecord extends ApiBaseDataModel {
  repository_id: number;
  parent_id?: number;
  composition_meta_id: number;
  user_id: number;
  started_at?: Date;
}

export interface Record extends BaseDataModel {
  repositoryId: number;
  parentId?: number;
  compositionMetaId: number;
  userId: number;
  startedAt?: Date;
}
