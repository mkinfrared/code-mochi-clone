/* eslint-disable camelcase */
export interface MovieProps {
  id: number;
  vote_count?: number;
  vote_average?: number;
  title?: string;
  popularity?: number;
  poster_path?: string;
  original_language?: string;
  original_title?: string;
  backdrop_path?: string;
  adult?: false;
  overview?: string;
  release_date?: string;
}

export interface MovieState {
  backdrop_path?: string;
  budget?: number;
  homepage?: string;
  id?: number;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  release_date?: string;
  revenue?: number;
  runtime?: number;
  tagline?: string;
  title?: string;
  vote_average?: number;
}
