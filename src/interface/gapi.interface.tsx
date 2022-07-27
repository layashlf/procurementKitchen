export interface authResultInterface {
  access_token: string;
  client_id: string;
  cookie_policy: string;
  expires_at: string;
  expires_in: string;
  scope: string;
  session_state: null;
  status: {
    google_logged_in: boolean;
    method: string;
    signed_in: boolean;
  };
  token_type: string;
  error: boolean;
}

export interface appStateInterface {
  gapiInitialized: boolean;
  userLoggedIn: boolean;
}
