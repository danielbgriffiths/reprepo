// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export interface ApiGeneratedCompositionMeta {
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

export interface GeneratedCompositionMeta {
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

export interface ApiCompositionMeta
  extends ApiBaseDataModel,
    ApiGeneratedCompositionMeta {
  author_meta_id: number;
}

export interface CompositionMeta
  extends BaseDataModel,
    GeneratedCompositionMeta {
  authorMetaId: number;
}

export interface ApiCompositionMetaFilterItem {
  id: number;
  full_title: string;
}
