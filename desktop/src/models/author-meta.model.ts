// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";
import {
  ApiCompositionMeta,
  CompositionMeta,
  ApiGeneratedCompositionMeta,
  GeneratedCompositionMeta,
} from "@models/index";

export interface ApiGeneratedAuthorMeta {
  full_name: string;
  first_name: string;
  last_name: string;
  middle?: string;
  born_at?: string;
  died_at?: string;
  birth_city?: string;
  birth_region?: string;
  birth_country?: string;
  nationality?: string;
  gender?: string;
  author_summary?: string;
}

export interface GeneratedAuthorMeta {
  fullName: string;
  firstName: string;
  lastName: string;
  middle?: string;
  bornAt?: string;
  diedAt?: string;
  birthCity?: string;
  birthRegion?: string;
  birthCountry?: string;
  nationality?: string;
  gender?: string;
  authorSummary?: string;
}

export interface ApiAuthorMeta
  extends ApiBaseDataModel,
    ApiGeneratedAuthorMeta {}

export interface AuthorMeta extends BaseDataModel, GeneratedAuthorMeta {}

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

export interface ApiGeneratedAuthorCompositionMeta {
  author_meta: ApiGeneratedAuthorMeta;
  composition_meta: ApiGeneratedCompositionMeta;
}

export interface GeneratedAuthorCompositionMeta {
  authorMeta: GeneratedAuthorMeta;
  compositionMeta: GeneratedCompositionMeta;
}
