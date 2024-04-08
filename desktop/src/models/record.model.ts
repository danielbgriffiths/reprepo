// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export interface ApiRecord extends ApiBaseDataModel {
  repository_id: number;
  parent_id?: number;
  name: string;
  author: string;
  category: string;
  authored_at?: Date;
  started_at?: Date;
}

export interface Record extends BaseDataModel {
  repositoryId: number;
  parentId?: number;
  name: string;
  author: string;
  category: string;
  authoredAt?: Date;
  startedAt?: Date;
}
