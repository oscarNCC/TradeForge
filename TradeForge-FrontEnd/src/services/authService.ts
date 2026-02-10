import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const TOKEN_KEY = 'token';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const { data: res } = await api.post<AuthResponse>('/api/auth/register', {
    email: data.email,
    password: data.password,
    username: data.username,
  });
  setToken(res.token);
  return res;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const { data: res } = await api.post<AuthResponse>('/api/auth/login', data);
  setToken(res.token);
  return res;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>('/api/auth/me');
  return data;
}
