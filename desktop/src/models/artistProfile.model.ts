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

export interface ApiArtistProfile {
  id: number;
  user_id: number;
  field: ArtistField;
  specialization: ArtistSpecialization;
  is_private: boolean;
  start_date: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface ArtistProfile {
  id: number;
  userId: number;
  field: ArtistField;
  specialization: ArtistSpecialization;
  isPrivate: boolean;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
