import { api } from './api';

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'dosen' | 'mahasiswa';
  nim?: string;
  nidn?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
  nim?: string;
  nidn?: string;
}

export const authService = {
  login(email: string, password: string): Promise<LoginResponse> {
    return api.post<LoginResponse>('/login', { email, password });
  },

  register(payload: RegisterPayload): Promise<{ user: User }> {
    return api.post<{ user: User }>('/register', payload);
  },

  logout(): Promise<void> {
    return api.post('/logout');
  },

  profile(): Promise<User> {
    return api.get<User>('/profile');
  },
};