import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://localhost:8000/api';
const TOKEN_KEY = 'abseen_auth_token';

async function loadToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function persistToken(token: string | null): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
      return;
    }
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch {
    
  }
}

let authToken: string | null = null;
export async function initAuthToken(): Promise<string | null> {
  authToken = await loadToken();
  return authToken;
}

export function setToken(token: string | null) {
  authToken = token;
  void persistToken(token);
}

export function getToken(): string | null {
  return authToken;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (options.method !== 'GET' && options.method !== 'DELETE') {
    headers['Content-Type'] = 'application/json';
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  console.log(`[API] ${options.method || 'GET'} ${endpoint}`, {
    hasToken: !!authToken,
    tokenPreview: authToken ? authToken.substring(0, 20) + '...' : 'none',
  });

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new ApiError(
      response.status,
      json.message || 'Terjadi kesalahan',
      json.errors,
    );
  }

  return json.data as T;
}

export const api = {
  get<T = unknown>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'GET' });
  },

  post<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T = unknown>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};

export { ApiError };