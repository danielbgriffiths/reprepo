// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export interface ApiCompositionMeta extends ApiBaseDataModel {
  genre: string;
  written_at?: string;
  full_title: string;
  piece_title?: string;
  set_title?: string;
  number_in_set?: string;
  movement?: number;
  opus?: number;
  kvv?: number;
  n?: number;
  variation?: number;
  key?: string;
  work_summary?: string;
}

export interface CompositionMeta extends BaseDataModel {
  genre: string;
  writtenAt?: string;
  fullTitle: string;
  pieceTitle?: string;
  setTitle?: string;
  numberInSet?: string;
  movement?: number;
  opus?: number;
  kvv?: number;
  n?: number;
  variation?: number;
  key?: string;
  workSummary?: string;
}

export interface ApiCompositionMetaFilterItem {
  id: number;
  full_title: string;
}
