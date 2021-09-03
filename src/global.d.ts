export type Scope =
  | "ugc-image-upload"
  | "playlist-modify-private"
  | "playlist-read-private"
  | "playlist-modify-public"
  | "playlist-read-collaborative"
  | "user-read-private"
  | "user-read-email"
  | "user-read-playback-state"
  | "user-modify-playback-state"
  | "user-read-currently-playing"
  | "user-library-modify"
  | "user-library-read"
  | "user-read-playback-position"
  | "user-read-recently-played"
  | "user-top-read"
  | "app-remote-control"
  | "streaming";

export interface ConfigPath {
  port: number;
  path?: string;
}

export interface NewTokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
}

export interface NewTokenCallback {
  (data: NewTokenData): void;
}
