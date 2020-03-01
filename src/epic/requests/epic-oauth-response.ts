export interface IEpicOauthResponse {
  access_token: string;
  expires_in: number;
  expires_at: string; // ISO format
  token_type: string;
  refresh_token: string;
  refresh_expires: number;
  refresh_expires_at: string; // ISO format
  account_id: string;
  client_id: string;
  internal_client: boolean;
  client_service: string;
  displayName: string;
  app: string;
  in_app_id: string;
  device_id: string;
};
