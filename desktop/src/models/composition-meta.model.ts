// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export interface ApiGeneratedCompositionMeta {
  id?: number;
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
  id?: number;
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
    Omit<ApiGeneratedCompositionMeta, "id"> {
  author_meta_id: number;
}

export interface CompositionMeta
  extends BaseDataModel,
    Omit<GeneratedCompositionMeta, "id"> {
  authorMetaId: number;
}

export interface ApiCompositionMetaFilterItem {
  id: number;
  full_title: string;
}
