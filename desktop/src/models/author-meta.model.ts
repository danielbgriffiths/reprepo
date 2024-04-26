// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";
import { ApiCompositionMeta, CompositionMeta } from "@models/index";

export interface ApiAuthorMeta extends ApiBaseDataModel {
  full_name: string;
  first_name: string;
  last_name: string;
  middle?: string;
  born_at?: string;
  died_at?: string;
  birth_location?: string;
  nationality?: string;
  gender?: string;
  author_summary?: string;
}

export interface AuthorMeta extends BaseDataModel {
  fullName: string;
  firstName: string;
  lastName: string;
  middle?: string;
  bornAt?: string;
  diedAt?: string;
  birthLocation?: string;
  nationality?: string;
  gender?: string;
  authorSummary?: string;
}

export interface AuthorCompositionMeta {
  authorMeta: AuthorMeta;
  compositionMeta: CompositionMeta;
}

export interface ApiAuthorMetaFilterItem {
  id: number;
  full_name: string;
}

export interface ApiAuthorCompositionMeta {
  author_meta: ApiAuthorMeta;
  composition_meta: ApiCompositionMeta;
}
