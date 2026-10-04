import { API_BASE_URL } from '../config';

class ApiClient {
  private refreshPromise: Promise<boolean> | null = null;

  private getHeaders(isFormData?: boolean): HeadersInit {
    const headers: HeadersInit = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  /**
   * Perform single-flight token refresh using refresh token HttpOnly cookie
   */
  private async attemptRefresh(): Promise<boolean> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          return false;
        }

        const data = await response.json();
        if (data?.data?.user) {
          localStorage.setItem('cms_user', JSON.stringify(data.data.user));
        }
        return true;
      } catch {
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const data: Record<string, unknown> =
      contentType && contentType.includes('application/json')
        ? await response.json()
        : { message: await response.text() };

    if (!response.ok) {
      const errors = data?.errors as Array<{ message?: string }> | undefined;
      const errorMessage =
        errors?.[0]?.message ||
        (typeof data?.message === 'string' && data.message) ||
        `Request failed with status ${response.status}`;
      const error = Object.assign(new Error(errorMessage), {
        status: response.status,
        data,
      });
      throw error;
    }

    return data as T;
  }

  private async executeFetch<T>(
    endpoint: string,
    options: RequestInit,
    isRetry = false
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
    });

    if (response.status === 401) {
      const isAuthEndpoint =
        endpoint.includes('/auth/login') ||
        endpoint.includes('/auth/logout') ||
        endpoint.includes('/auth/refresh');

      // Attempt refresh if not an auth endpoint and not already retried
      if (!isAuthEndpoint && !isRetry) {
        const refreshed = await this.attemptRefresh();
        if (refreshed) {
          return this.executeFetch<T>(endpoint, options, true);
        }
      }

      // If refresh failed or was not eligible, clean up cached session
      if (!isAuthEndpoint) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
      }
    }

    return this.handleResponse<T>(response);
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    return this.executeFetch<T>(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.executeFetch<T>(endpoint, {
      method: 'POST',
      headers: this.getHeaders(isFormData),
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.executeFetch<T>(endpoint, {
      method: 'PUT',
      headers: this.getHeaders(isFormData),
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.executeFetch<T>(endpoint, {
      method: 'PATCH',
      headers: this.getHeaders(isFormData),
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.executeFetch<T>(endpoint, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }
}

export const apiClient = new ApiClient();

