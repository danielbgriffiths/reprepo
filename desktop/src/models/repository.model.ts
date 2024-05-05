// Local Imports
import { ApiBaseDataModel, BaseDataModel } from "@models/api.model";

export enum ArtistField {
  Musician = "Musician",
  Dancer = "Dancer",
  VisualArtist = "VisualArtist",
}

export enum ArtistSpecialization {
  Piano = "Piano",
  Violin = "Violin",
  Cello = "Cello",
  Voice = "Voice",
  Guitar = "Guitar",
  GraphicDesigner = "GraphicDesigner",
  FineArt = "FineArt",
  Film = "Film",
  Ballet = "Ballet",
  HipHop = "HipHop",
  ExoticDance = "ExoticDance",
}

export interface ApiRepository extends ApiBaseDataModel {
  user_id: number;
  name: string;
  field: ArtistField;
  specialization: ArtistSpecialization;
  is_private: boolean;
  start_date: Date;
  description?: string;
  social_links?: string[];
}

export interface Repository extends BaseDataModel {
  name: string;
  userId: number;
  field: ArtistField;
  specialization: ArtistSpecialization;
  isPrivate: boolean;
  startDate: Date;
  description?: string;
  socialLinks?: string[];
}

export interface CommitCalendarDay {
  date: string;
  density: number;
  count: number;
}

export interface CommitCalendarHeader {
  count: number;
}

export interface CommitCalendarRow {
  days: CommitCalendarDay[];
}

export interface CommitCalendarTable {
  headers: CommitCalendarHeader[];
  rows: CommitCalendarRow[];
}
