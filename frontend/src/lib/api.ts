const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  refreshToken?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  errors?: Array<{ field: string; message: string }>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Try to refresh token on 401
      if (response.status === 401 && typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && !endpoint.includes('/refresh-token')) {
          try {
            const refreshResponse = await fetch(`${this.baseUrl}/users/refresh-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });
            const refreshData = await refreshResponse.json();
            if (refreshData.success && refreshData.token) {
              localStorage.setItem('token', refreshData.token);
              if (refreshData.refreshToken) {
                localStorage.setItem('refreshToken', refreshData.refreshToken);
              }
              // Retry original request with new token
              (headers as Record<string, string>)['Authorization'] = `Bearer ${refreshData.token}`;
              const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });
              return await retryResponse.json();
            }
          } catch {
            // Refresh failed, clear tokens
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        }
      }

      const error = new Error(data.message || 'API request failed') as Error & { status: number; data: unknown };
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);
export type { ApiResponse };
