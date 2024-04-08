// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export interface ApiCommit extends ApiBaseDataModel {
  record_id: number;
  notes: string;
}

export interface Commit extends BaseDataModel {
  recordId: number;
  notes: string;
}
