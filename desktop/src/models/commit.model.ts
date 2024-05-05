// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export interface ApiCommit extends ApiBaseDataModel {
  record_id: number;
  title: string;
  notes: string;
}

export interface Commit extends BaseDataModel {
  recordId: number;
  title: string;
  notes: string;
}
