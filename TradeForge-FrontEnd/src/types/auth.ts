export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
  confirmPassword?: string;
}

export interface User {
  id: number;
  email: string;
  username: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
