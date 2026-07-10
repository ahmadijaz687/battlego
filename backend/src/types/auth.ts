export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  goal?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  };
  tokens: TokenPair;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
