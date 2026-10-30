export interface AuthUser {
  userId: string;
  email: string;
  name?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Accommodates common token field names returned by login APIs.
export interface LoginResponse {
  access_token?: string;
  accessToken?: string;
  token?: string;
}